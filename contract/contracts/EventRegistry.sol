// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EventRegistry is Ownable, ReentrancyGuard {
    
    // State Variables
    uint256 public eventCreationFee = 0.01 ether;
    uint256 public nextEventId = 1;
    address public treasuryAddress;
    
    // Structs
    struct Event {
        uint256 eventId;
        address organizer;
        string metadataHash; // IPFS hash for event details
        uint256 createdAt;
        uint256 attendanceFee; // Fee per attendee (0 for free events)
        bool isActive;
        uint256 maxAttendees;
        uint256 currentAttendees;
    }
    
    // Mappings
    mapping(uint256 => Event) public events;
    mapping(address => uint256[]) public organizerEvents;
    
    // Events
    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string metadataHash,
        uint256 attendanceFee,
        uint256 timestamp
    );
    
    event EventUpdated(uint256 indexed eventId, bool isActive);
    
    // Constructor
    constructor(address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }
    
    // Functions
    function createEvent(
        string memory _metadataHash,
        uint256 _attendanceFee,
        uint256 _maxAttendees
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= eventCreationFee, "Insufficient event creation fee");
        require(bytes(_metadataHash).length > 0, "Metadata hash required");
        require(_maxAttendees > 0, "Max attendees must be > 0");
        
        uint256 eventId = nextEventId++;
        
        events[eventId] = Event({
            eventId: eventId,
            organizer: msg.sender,
            metadataHash: _metadataHash,
            createdAt: block.timestamp,
            attendanceFee: _attendanceFee,
            isActive: true,
            maxAttendees: _maxAttendees,
            currentAttendees: 0
        });
        
        organizerEvents[msg.sender].push(eventId);
        
        // Transfer creation fee to treasury
        (bool success, ) = treasuryAddress.call{value: msg.value}("");
        require(success, "Fee transfer failed");
        
        emit EventCreated(eventId, msg.sender, _metadataHash, _attendanceFee, block.timestamp);
        
        return eventId;
    }
    
    function getEvent(uint256 _eventId) external view returns (Event memory) {
        require(_eventId < nextEventId, "Event does not exist");
        return events[_eventId];
    }
    
    function getOrganizerEvents(address _organizer) external view returns (uint256[] memory) {
        return organizerEvents[_organizer];
    }
    
    function toggleEventStatus(uint256 _eventId) external {
        require(events[_eventId].organizer == msg.sender, "Not event organizer");
        events[_eventId].isActive = !events[_eventId].isActive;
        emit EventUpdated(_eventId, events[_eventId].isActive);
    }
    
    function updateEventCreationFee(uint256 _newFee) external onlyOwner {
        eventCreationFee = _newFee;
    }
    
    function updateTreasuryAddress(address _newTreasury) external onlyOwner {
        treasuryAddress = _newTreasury;
    }
}