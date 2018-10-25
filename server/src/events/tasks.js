import App from "../app";
import { pubsub } from "../helpers/subscriptionManager.js";
import * as Classes from "../classes";
import uuid from "uuid";

App.on("addTask", ({ taskInput }) => {
  App.tasks.push(new Classes.Task(taskInput));
  pubsub.publish(
    "tasksUpdate",
    App.tasks.filter(s => s.simulatorId === taskInput.simulatorId)
  );
});

App.on("verifyTask", ({ taskId, dismiss }) => {
  const task = App.tasks.find(t => t.id === taskId);
  if (task) {
    task.verify(dismiss);
    pubsub.publish(
      "tasksUpdate",
      App.tasks.filter(s => s.simulatorId === task.simulatorId)
    );
  }
});

App.on("dismissVerifiedTasks", ({ simulatorId }) => {
  const tasks = App.tasks.filter(t => t.simulatorId === simulatorId);
  if (tasks.length > 0) {
    tasks.forEach(t => {
      if (t.verified) t.dismiss();
    });
    pubsub.publish("tasksUpdate", tasks);
  }
});

App.on("requestTaskVerify", ({ id }) => {
  const task = App.tasks.find(t => t.id === id);
  task.requestVerify();
  pubsub.publish(
    "tasksUpdate",
    App.tasks.filter(s => s.simulatorId === task.simulatorId)
  );
  pubsub.publish("notify", {
    id: uuid.v4(),
    simulatorId: task.simulatorId,
    type: "Tasks",
    station: "Core",
    title: `Task Verification`,
    body: `${task.station} - ${task.values.name || task.definition}`,
    color: "info"
  });
  App.handleEvent(
    {
      simulatorId: task.simulatorId,
      component: "TasksCore",
      title: `Task Verification`,
      body: `${task.station} - ${task.values.name || task.definition}`,
      color: "info"
    },
    "addCoreFeed"
  );
});

App.on("denyTaskVerify", ({ id }) => {
  const task = App.tasks.find(t => t.id === id);
  task.denyVerify();
  pubsub.publish(
    "tasksUpdate",
    App.tasks.filter(s => s.simulatorId === task.simulatorId)
  );
  pubsub.publish("notify", {
    id: uuid.v4(),
    simulatorId: task.simulatorId,
    type: "Tasks",
    station: task.station,
    title: `Task Verification Failed`,
    body: task.values.name || task.definition,
    color: "warning"
  });
});
