pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    event TaskCompleted(uint id, bool completed);

    constructor() public{
        //default task
        createTask("Take a walk around the block");
    }

  function createTask(string memory _content) public {
    //puts task in the mapping
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskCreated(taskCount, _content, false);
  }

  function toggleCompleted(uint _id) public{
    //move task out of mapping
    Task memory _task = tasks[_id];
    //set !completed
    _task.completed = !_task.completed;
    //put back into mapping
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }

}