const AsianSoloBet = artifacts.require("AsianSoloBet");

var offerNewMatch = (owner) => {

}

describe('When offer new match',() =>{


  contract("AsianSoloBet", accounts => {
    const [firstAccount] = accounts;
    const owner = accounts[0]
    const matchTime = 1548728850000;
    const homeTeam = "Rusia";
    const awayTeam = "USA";
    let contract;


    beforeEach('setup contract for each test', async () => {
      contract = await AsianSoloBet.new();
      //offerNewMatch(owner);
    })

    it("sets an owner", async () => {

      assert.equal(await contract.owner.call(), firstAccount);
    });

    it("findMatchAndBetting", async()=> {
      contract.offerNewMatch(0x123,homeTeam, awayTeam,matchTime,-25, {value: 3000000000000000000});
      // const asianSoloBet = await AsianSoloBet.new();
      contract.findMatch(0x123).then(result => {
        var expectedHomeTeam = "Rusia";
        var expectedAwayTeam = "USA";
        assert.equal(result[0], expectedHomeTeam,"newOfferMatch should update hometeam name correctly")

        assert.equal(result[1], expectedAwayTeam,"newOfferMatch should update awayteam name correctly")
        assert.equal(result[2].toNumber(), 0,"newOfferMatch should default home team score is 0")
        assert.equal(result[3].toNumber(), 0,"newOfferMatch should default away team score is 0")
        assert.equal(result[4].toNumber(), 1548728850000,"newOfferMatch should update time correctly")
        assert.equal(result[5].toNumber(), 1,"newOfferMatch should match status is Open (1)")
      });

      contract.getBettingInfo(0x123,0).then(result=>{
        console.log(result);
        assert.equal(result[0], owner, "newOfferMatch should store bookmarker is sender");
        assert.equal(result[1], 0x0, "newOfferMatch should store punter is 0x0");
        assert.equal(result[2].toNumber(), -25, "newOfferMatch should store odds is -25");
        assert.equal(result[3].toNumber(),3000000000000000000, "newOfferMatch should store stake is 3 ether");
        assert.equal(result[4].toNumber(),0, "newOfferMatch should store betting state is opening (1)");
      });

    });
  });
});

