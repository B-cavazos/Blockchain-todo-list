App = {
      loading: false,
      contracts:{},
    load: async () =>{ //load app
        await App.loadWeb3(); //web3js to talk to the blockchain
        await App.loadAccount();
        await App.loadContract();
        await App.render();
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
        // Accounts now exposed
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

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },


  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId)
    window.location.reload()
  },

  createTask: async ()=>{
    App.setLoading(true);
    const content = $('#newTask').val();
    await App.todoList.createTask(content);
    //app reload and refetch all tasks
    window.location.reload();
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}


$(()=>{
    $(window).load(()=>{
        App.load()
    })
})