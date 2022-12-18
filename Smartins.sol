// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Smartins {

    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        uint bought;   // amount bought
        uint claimed; // amount claimed
    }

    struct Proposal {
        // If you can limit the length to a certain number of bytes, 
        // always use one of bytes1 to bytes32 because they are much cheaper
        string name;   // short name (up to 32 bytes) location
        string time; // time of insurance
        uint ratio; // number of accumulated votes
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    Proposal public proposal;


    constructor(string memory proposalName, string memory proposalTime, uint proposalRatio) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        proposal = Proposal({
            name: proposalName,
            time: proposalTime,
            ratio: proposalRatio
        });
    }

    /** 
     * @dev Give 'voter' the right to vote on this ballot. May only be called by 'chairperson'.
     * @param voter address of voter
     */
    function giveRightToVote(address voter) public {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }


    function vote(uint amount) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to buy");
        require(!sender.voted, "Already bought.");
        sender.voted = true;
        sender.bought = amount;
    }

    function claim() public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to buy");
        require(sender.voted, "Has not bought.");
        sender.voted = false;
        sender.claimed += sender.bought * proposal.ratio;        
        sender.bought = 0;
    }


    function voterBought() public view
            returns (uint amount_)
    {
        amount_ = voters[msg.sender].bought;
    }

    function voterClaimed() public view
            returns (uint amount_)
    {
        amount_ = voters[msg.sender].claimed;
    }
}