// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EventTicket
 * @dev Dynamic NFT (dNFT) ticketing system for events
 * This contract solves current ticketing issues:
 * - Fraud & Duplication: Blockchain immutability prevents fake tickets
 * - Lack of Lasting Value: dNFTs evolve post-event into collectibles
 * - Decentralized Ownership: Users truly own their tickets
 * - Secondary Market Control: Can be extended with resale rules
 */
contract EventTicket is ERC721, Ownable {
    uint256 private _tokenIds;
    
    // Event information
    string public eventName;
    string public eventSymbol;
    address public organizer;
    
    // Mapping to store metadata URIs for each token
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bool) private _isUsed;
    
    // Events
    event TicketMinted(uint256 indexed tokenId, address indexed recipient, string metadataURI);
    event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
    event TicketBurned(uint256 indexed tokenId);
    
    /**
     * @dev Modifier to restrict function access to organizer only
     */
    modifier onlyOrganizer() {
        require(msg.sender == organizer, "EventTicket: caller is not the organizer");
        _;
    }
    
    /**
     * @dev Constructor initializes the event ticket contract
     * @param _eventName Name of the event
     * @param _eventSymbol Symbol for the event tickets
     * @param _organizer Address of the event organizer
     */
    constructor(
        string memory _eventName,
        string memory _eventSymbol,
        address _organizer
    ) ERC721(_eventName, _eventSymbol) Ownable(_organizer) {
        eventName = _eventName;
        eventSymbol = _eventSymbol;
        organizer = _organizer;
    }
    
    /**
     * @dev Mints a new ticket (NFT) for the specified recipient
     * @param recipient Address of the ticket holder
     * @param preEventMetadataURI Metadata URI for the pre-event state
     * @return tokenId The ID of the newly minted ticket
     */
    function mint(address recipient, string memory preEventMetadataURI) 
        public 
        onlyOrganizer 
        returns (uint256) 
    {
        require(recipient != address(0), "EventTicket: recipient cannot be zero address");
        require(bytes(preEventMetadataURI).length > 0, "EventTicket: metadata URI cannot be empty");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(recipient, newTokenId);
        _tokenURIs[newTokenId] = preEventMetadataURI;
        _isUsed[newTokenId] = false;
        
        emit TicketMinted(newTokenId, recipient, preEventMetadataURI);
        return newTokenId;
    }
    
    /**
     * @dev Updates the metadata URI of a ticket to its post-event state
     * @param tokenId The ID of the ticket to update
     * @param postEventMetadataURI New metadata URI for the post-event state
     */
    function updateMetadataURI(uint256 tokenId, string memory postEventMetadataURI) 
        public 
        onlyOrganizer 
    {
        require(ownerOf(tokenId) != address(0), "EventTicket: ticket does not exist");
        require(bytes(postEventMetadataURI).length > 0, "EventTicket: metadata URI cannot be empty");
        
        _tokenURIs[tokenId] = postEventMetadataURI;
        _isUsed[tokenId] = true;
        
        emit MetadataUpdated(tokenId, postEventMetadataURI);
    }
    
    /**
     * @dev Burns a used ticket
     * @param tokenId The ID of the ticket to burn
     */
    function burn(uint256 tokenId) public onlyOrganizer {
        require(ownerOf(tokenId) != address(0), "EventTicket: ticket does not exist");
        
        _burn(tokenId);
        delete _tokenURIs[tokenId];
        delete _isUsed[tokenId];
        
        emit TicketBurned(tokenId);
    }
    
    /**
     * @dev Returns the metadata URI for a given token ID
     * @param tokenId The ID of the ticket
     * @return The metadata URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "EventTicket: ticket does not exist");
        return _tokenURIs[tokenId];
    }
    
    /**
     * @dev Returns whether a ticket has been used (checked in)
     * @param tokenId The ID of the ticket
     * @return True if the ticket has been used, false otherwise
     */
    function isTicketUsed(uint256 tokenId) public view returns (bool) {
        require(ownerOf(tokenId) != address(0), "EventTicket: ticket does not exist");
        return _isUsed[tokenId];
    }
    
    /**
     * @dev Returns the total number of tickets minted
     * @return The total supply of tickets
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Returns the next token ID that will be minted
     * @return The next token ID
     */
    function getNextTokenId() public view returns (uint256) {
        return _tokenIds + 1;
    }
    
    // Future: Add secondary market rules here
    // Example: Set maximum resale price, royalty fees, etc.
}
