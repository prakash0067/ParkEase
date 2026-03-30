// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ParkEase {
    // 1. UPGRADED STRUCT: Now tracks time and vehicle ID
    struct Slot {
        uint id;
        address bookedBy;
        bool isOccupied;
        uint parkTime;          // Tracks the exact second they parked
        string licensePlate;    // Stores the vehicle's plate number
    }

    uint public totalSlots;
    address public owner;
    uint public ratePerMinute;  // How much to charge per minute
    bool public isPaused;       // The Emergency Circuit Breaker

    mapping(uint => Slot) public parkingSlots;

    // 2. EVENTS: These tell the React frontend to update instantly
    event SlotBooked(uint indexed slotId, address indexed user, string licensePlate, uint timestamp);
    event SlotReleased(uint indexed slotId, address indexed user, uint feePaid, uint timestamp);
    event EmergencyStopToggled(bool isPaused);

    // Modifiers act as security checkpoints for functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do this");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Parking facility is currently closed for maintenance");
        _;
    }

    constructor(uint _totalSlots) {
        owner = msg.sender;
        totalSlots = _totalSlots;
        ratePerMinute = 0.001 ether; // Charging 0.001 ETH per minute for our demo

        for(uint i = 1; i <= totalSlots; i++) {
            parkingSlots[i] = Slot(i, address(0), false, 0, "");
        }
    }

    // 3. UPDATED BOOKING: Now requires a license plate string, but NO upfront payment
    function bookSlot(uint _slotId, string memory _licensePlate) public whenNotPaused {
        require(_slotId > 0 && _slotId <= totalSlots, "Invalid slot ID");
        require(!parkingSlots[_slotId].isOccupied, "Slot is already booked!");

        parkingSlots[_slotId].bookedBy = msg.sender;
        parkingSlots[_slotId].isOccupied = true;
        parkingSlots[_slotId].parkTime = block.timestamp; // Start the clock!
        parkingSlots[_slotId].licensePlate = _licensePlate;

        // Shout to the React app that a booking happened
        emit SlotBooked(_slotId, msg.sender, _licensePlate, block.timestamp);
    }

    // Helper function to calculate the dynamic fee
    function calculateFee(uint _slotId) public view returns (uint) {
        if (!parkingSlots[_slotId].isOccupied) return 0;
        
        uint timeParked = block.timestamp - parkingSlots[_slotId].parkTime;
        uint minutesParked = (timeParked / 60) + 1; // +1 ensures they pay for at least 1 minute even if they leave instantly
        
        return minutesParked * ratePerMinute;
    }

    // 4. UPDATED RELEASE: The user now pays WHEN they leave, based on time
    function releaseSlot(uint _slotId) public payable {
        require(_slotId > 0 && _slotId <= totalSlots, "Invalid slot ID");
        require(parkingSlots[_slotId].isOccupied, "Slot is already empty!");
        require(parkingSlots[_slotId].bookedBy == msg.sender, "You can only release your own slot!");

        // Calculate fee and check if they sent enough ETH
        uint fee = calculateFee(_slotId);
        require(msg.value >= fee, "Insufficient ETH sent to pay the parking bill!");

        // If they accidentally sent too much ETH, refund the difference
        if (msg.value > fee) {
            payable(msg.sender).transfer(msg.value - fee);
        }

        // Reset the slot
        parkingSlots[_slotId].bookedBy = address(0);
        parkingSlots[_slotId].isOccupied = false;
        parkingSlots[_slotId].parkTime = 0;
        parkingSlots[_slotId].licensePlate = "";

        // Shout to the React app that the slot is free
        emit SlotReleased(_slotId, msg.sender, fee, block.timestamp);
    }

    function getAllSlots() public view returns (Slot[] memory) {
        Slot[] memory slotsArray = new Slot[](totalSlots);
        for (uint i = 1; i <= totalSlots; i++) {
            slotsArray[i - 1] = parkingSlots[i];
        }
        return slotsArray;
    }

    // 5. OWNER FUNCTION: The Circuit Breaker
    function togglePause() public onlyOwner {
        isPaused = !isPaused;
        emit EmergencyStopToggled(isPaused);
    }

    // 6. OWNER FUNCTION: Collect the revenue
    function withdrawEarnings() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}