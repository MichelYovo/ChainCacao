// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CacaoTraceability
 * @dev Simple contract to track cacao lots on the Polygon blockchain.
 */
contract CacaoTraceability {
    struct LotHistory {
        string status;
        uint256 timestamp;
        string actor;
        string details;
    }

    struct Lot {
        string id;
        string producer;
        uint256 quantity;
        string origin;
        string currentStatus;
        LotHistory[] history;
    }

    mapping(string => Lot) private lots;

    event LotCreated(string lotId, string producer);
    event StatusUpdated(string lotId, string newStatus);

    function createLot(string memory _id, string memory _producer, uint256 _quantity, string memory _origin) public {
        Lot storage newLot = lots[_id];
        newLot.id = _id;
        newLot.producer = _producer;
        newLot.quantity = _quantity;
        newLot.origin = _origin;
        newLot.currentStatus = "Harvested";
        
        newLot.history.push(LotHistory("Harvested", block.timestamp, _producer, "Initial harvest registration"));
        
        emit LotCreated(_id, _producer);
    }

    function updateStatus(string memory _id, string memory _newStatus, string memory _actor, string memory _details) public {
        lots[_id].currentStatus = _newStatus;
        lots[_id].history.push(LotHistory(_newStatus, block.timestamp, _actor, _details));
        
        emit StatusUpdated(_id, _newStatus);
    }

    function getLotHistory(string memory _id) public view returns (LotHistory[] memory) {
        return lots[_id].history;
    }
}
