

App = {
    contracts:{},
    load: async () =>{ //load app
        
        await App.loadWeb3(); //web3js to talk to the blockchain
        await App.loadAccount();
        await App.loadContract();
        web3.eth.defaultAccount = web3.eth.accounts[0]
    },
 // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
 loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
        
      window.web3 = new Web3(ethereum)
      try {
        console.log('modern try')
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        console.log('modern catch')
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Accounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }, 

  loadAccount: async ()=>{
    App.account = web3.eth.accounts[0]
  },
  loadContract: async ()=>{
    //create JS version of smart contract
    const todoList = await $.getJSON('TodoList.json');
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);

    //Hydrate smart contract w values from blockchain
    App.todoList = await App.contracts.TodoList.deployed();
  },
}




$(()=>{
    $(window).load(()=>{
        App.load()
    })
})