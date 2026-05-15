// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CacaoTrace {
    
    struct LotRecord {
        string lotId;
        address producer;
        uint256 quantity;
        string origin;
        string gps;
        uint256 timestamp;
        uint8 status;
        bytes32 contentHash;
    }
    
    struct StatusUpdate {
        uint8 status;
        string label;
        uint256 date;
        address actor;
        bytes32 transactionHash;
    }
    
    mapping(string => LotRecord) public lots;
    mapping(string => StatusUpdate[]) public lotHistory;
    
    event LotCreated(string indexed lotId, address indexed producer, uint256 timestamp);
    event StatusUpdated(string indexed lotId, uint8 newStatus, address indexed actor, uint256 timestamp);
    
    // Enregistrer un lot de cacao
    function recordLot(
        string memory lotId,
        uint256 quantity,
        string memory origin,
        string memory gps,
        uint8 initialStatus
    ) public {
        require(bytes(lotId).length > 0, "Lot ID required");
        require(quantity > 0, "Quantity must be > 0");
        
        LotRecord memory newLot = LotRecord({
            lotId: lotId,
            producer: msg.sender,
            quantity: quantity,
            origin: origin,
            gps: gps,
            timestamp: block.timestamp,
            status: initialStatus,
            contentHash: keccak256(abi.encodePacked(lotId, msg.sender, quantity, origin))
        });
        
        lots[lotId] = newLot;
        
        // Enregistrer le premier status
        lotHistory[lotId].push(StatusUpdate({
            status: initialStatus,
            label: "Récolte Enregistrée",
            date: block.timestamp,
            actor: msg.sender,
            transactionHash: blockhash(block.number - 1)
        }));
        
        emit LotCreated(lotId, msg.sender, block.timestamp);
    }
    
    // Mettre à jour le status d'un lot
    function updateLotStatus(
        string memory lotId,
        uint8 newStatus,
        string memory label
    ) public {
        require(bytes(lotId).length > 0, "Lot ID required");
        LotRecord storage lot = lots[lotId];
        require(lot.quantity > 0, "Lot does not exist");
        
        lot.status = newStatus;
        
        lotHistory[lotId].push(StatusUpdate({
            status: newStatus,
            label: label,
            date: block.timestamp,
            actor: msg.sender,
            transactionHash: blockhash(block.number - 1)
        }));
        
        emit StatusUpdated(lotId, newStatus, msg.sender, block.timestamp);
    }
    
    // Récupérer les détails d'un lot
    function getLot(string memory lotId) public view returns (LotRecord memory) {
        return lots[lotId];
    }
    
    // Récupérer l'historique d'un lot
    function getLotHistory(string memory lotId) public view returns (StatusUpdate[] memory) {
        return lotHistory[lotId];
    }
    
    // Vérifier l'intégrité d'un lot
    function verifyLot(string memory lotId) public view returns (bool) {
        LotRecord memory lot = lots[lotId];
        return lot.quantity > 0;
    }
}
