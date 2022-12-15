pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

constructor() public{
    //default task
    createTask("Take a walk around the block");
}

  function createTask(string memory _content) public {
    //puts task in the mapping
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
  }

}