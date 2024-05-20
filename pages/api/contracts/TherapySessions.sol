// backend/contracts/TherapySessions.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TherapySessions {
    struct Session {
        uint id;
        address user;
        address therapist;
        uint dateTime;
        uint amount;
        SessionStatus status;
    }

    enum SessionStatus { PENDING, COMPLETED, CANCELLED }

    uint public sessionCount = 0;
    mapping(uint => Session) public sessions;

    event SessionCreated(uint id, address user, address therapist, uint dateTime, uint amount, SessionStatus status);
    event SessionCompleted(uint id, address user, address therapist);
    event SessionCancelled(uint id, address user, address therapist);

    function createSession(address _therapist, uint _dateTime) public payable {
        require(msg.value > 0, "Payment required");

        sessionCount++;
        sessions[sessionCount] = Session(sessionCount, msg.sender, _therapist, _dateTime, msg.value, SessionStatus.PENDING);
        emit SessionCreated(sessionCount, msg.sender, _therapist, _dateTime, msg.value, SessionStatus.PENDING);
    }

    function completeSession(uint _id) public {
        Session storage session = sessions[_id];
        require(msg.sender == session.therapist, "Only therapist can complete the session");
        require(session.status == SessionStatus.PENDING, "Session not pending");

        session.status = SessionStatus.COMPLETED;
        payable(session.therapist).transfer(session.amount);
        emit SessionCompleted(session.id, session.user, session.therapist);
    }

    function cancelSession(uint _id) public {
        Session storage session = sessions[_id];
        require(msg.sender == session.user, "Only user can cancel the session");
        require(session.status == SessionStatus.PENDING, "Session not pending");

        session.status = SessionStatus.CANCELLED;
        payable(session.user).transfer(session.amount);
        emit SessionCancelled(session.id, session.user, session.therapist);
    }
}
