// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./EventRegistry.sol";

contract AttendanceVerifier is ReentrancyGuard {
    
    EventRegistry public eventRegistry;
    address public treasuryAddress;
    uint256 public platformFeeBasisPoints = 50; // 0.5%
    
    // Structs
    struct Attendance {
        uint256 eventId;
        address attendee;
        uint256 timestamp;
        bool verified;
    }
    
    // Mappings
    mapping(uint256 => mapping(address => Attendance)) public attendances;
    mapping(uint256 => address[]) public eventAttendees;
    mapping(address => uint256[]) public attendeeHistory;
    
    // Events
    event CheckIn(
        uint256 indexed eventId,
        address indexed attendee,
        uint256 timestamp,
        uint256 feePaid
    );
    
    event AttendanceVerified(uint256 indexed eventId, address indexed attendee);
    
    // Constructor
    constructor(address _eventRegistryAddress, address _treasuryAddress) {
        eventRegistry = EventRegistry(_eventRegistryAddress);
        treasuryAddress = _treasuryAddress;
    }
    
    // Functions
    function checkIn(uint256 _eventId) external payable nonReentrant {
        // Get event details
        EventRegistry.Event memory evt = eventRegistry.getEvent(_eventId);
        
        require(evt.isActive, "Event is not active");
        require(evt.currentAttendees < evt.maxAttendees, "Event is full");
        require(!attendances[_eventId][msg.sender].verified, "Already checked in");
        require(msg.value >= evt.attendanceFee, "Insufficient attendance fee");
        
        // Record attendance
        attendances[_eventId][msg.sender] = Attendance({
            eventId: _eventId,
            attendee: msg.sender,
            timestamp: block.timestamp,
            verified: true
        });
        
        eventAttendees[_eventId].push(msg.sender);
        attendeeHistory[msg.sender].push(_eventId);
        
        // Handle payment split if fee > 0
        if (msg.value > 0) {
            uint256 platformFee = (msg.value * platformFeeBasisPoints) / 10000;
            uint256 organizerAmount = msg.value - platformFee;
            
            // Send to organizer
            (bool orgSuccess, ) = evt.organizer.call{value: organizerAmount}("");
            require(orgSuccess, "Organizer payment failed");
            
            // Send to treasury
            (bool treasurySuccess, ) = treasuryAddress.call{value: platformFee}("");
            require(treasurySuccess, "Treasury payment failed");
        }
        
        emit CheckIn(_eventId, msg.sender, block.timestamp, msg.value);
    }
    
    function verifyAttendance(uint256 _eventId, address _attendee) external view returns (bool) {
        return attendances[_eventId][_attendee].verified;
    }
    
    function getEventAttendees(uint256 _eventId) external view returns (address[] memory) {
        return eventAttendees[_eventId];
    }
    
    function getAttendeeHistory(address _attendee) external view returns (uint256[] memory) {
        return attendeeHistory[_attendee];
    }
    
    function getAttendanceCount(uint256 _eventId) external view returns (uint256) {
        return eventAttendees[_eventId].length;
    }
    
    function updatePlatformFee(uint256 _newFeeBasisPoints) external {
        require(msg.sender == treasuryAddress, "Only treasury can update");
        require(_newFeeBasisPoints <= 1000, "Fee too high (max 10%)");
        platformFeeBasisPoints = _newFeeBasisPoints;
    }
}