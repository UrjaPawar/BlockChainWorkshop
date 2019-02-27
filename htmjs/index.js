import Web3 from "web3";
import crowdFundingArtifact from "../../build/contracts/StupidCrowdfunding.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      console.log(networkId);
      const deployedNetwork = crowdFundingArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        crowdFundingArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      this.refreshBalance();
      console.log(this.meta);
        this.listenToEvents();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  listenToEvents: function() {
    const eventLister = document.getElementById("events");
    this.meta.events.ReceivedContribution((error, result) => {
    console.log("Err:",error);
    console.log("Event: ",result);    
    eventLister.innerHTML += "\n" + JSON.stringify(result);
  });
  this.meta.events.Disclosed((error, result) => {
    console.log("Err:",error);
    console.log("Event: ",result);
    eventLister.innerHTML += "\n" + JSON.stringify(result);
    });
},

  refreshBalance: async function() {
    const { getBalance } = this.meta.methods;
    const balance = await getBalance().call();
    console.log(balance);
    const balanceElement = document.getElementById("bal");
    balanceElement.innerHTML = balance;
  },

  sendEther: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const { contribute } = this.meta.methods;
    await contribute().send({ from: this.account, value: web3.toWei(amount,"ether") });
    this.listenToEvents();
  },

  knowTheAlgo: async function() {
    const { isOpen } = this.meta.methods;
    await isOpen().send({ from: this.account });
    this.listenToEvents();
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
    );
  }

  App.start();
});