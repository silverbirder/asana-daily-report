function isToday(dateString) {
  const taskDate = new Date(dateString);
  const today = new Date();
  return taskDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
}

function getAsanaTasks(projectId, sectionName, accessToken) {
  const baseUrl = "https://app.asana.com/api/1.0";
  const token = accessToken || "YOUR_ASANA_ACCESS_TOKEN";
  const user = JSON.parse(UrlFetchApp.fetch(baseUrl + "/users/me", {
    headers: { "Authorization": "Bearer " + token }
  })).data;

  const project = JSON.parse(UrlFetchApp.fetch(baseUrl + `/projects/${projectId}`, {
    headers: { "Authorization": "Bearer " + token }
  })).data;

  if (!project) {
    throw new Error("プロジェクトが見つかりませんでした。");
  }

  const sections = JSON.parse(UrlFetchApp.fetch(baseUrl + `/projects/${projectId}/sections`, {
    headers: { "Authorization": "Bearer " + token }
  })).data;

  const section = sections.find(s => s.name === sectionName);

  if (!section) {
    throw new Error("セクションが見つかりませんでした。");
  }

  const tasks = JSON.parse(UrlFetchApp.fetch(baseUrl + `/sections/${section.gid}/tasks?opt_fields=name,assignee,assignee_status,completed_by,completed_at,created_by,created_at,permalink_url`, {
    headers: { "Authorization": "Bearer " + token }
  })).data;

  const filteredTasks = tasks.filter(task => {
    if (sectionName === "In Progress") {
      return task.assignee && task.assignee.gid === user.gid;
    } else if (sectionName === "Done") {
      return task.assignee && task.assignee.gid === user.gid && task.completed_by && task.completed_by.gid === user.gid && isToday(task.completed_at);
    } else if (sectionName === "Backlog") {
      return task.created_by && task.created_by.gid === user.gid && isToday(task.created_at);
    } else {
      return false;
    }
  });

  return filteredTasks;
}

function getUserIdFromUsername(username, botToken) {
  const baseUrl = "https://slack.com/api";
  const response = UrlFetchApp.fetch(baseUrl + "/users.list", {
    headers: { "Authorization": "Bearer " + botToken }
  });

  const users = JSON.parse(response.getContentText()).members;
  const user = users.find(u => u.name === username);
  
  if (!user) {
    throw new Error("ユーザーが見つかりませんでした。");
  }

  return user.id;
}

function sendToSlack(tasks, sectionName, slackUserId, botToken, channelId) {
  const baseUrl = "https://slack.com/api";
  const header = {
    "Authorization": "Bearer " + botToken,
    "Content-Type": "application/json"
  };

  const emojiForSection = {
    "In Progress": ":construction:",
    "Done": ":white_check_mark:",
    "Backlog": ":memo:"
  };
  const sectionEmoji = emojiForSection[sectionName];
  const sectionMessages = {
    "In Progress": "<In Progress> 本日、あなたが着手したタスク一覧",
    "Done": "<Done> 本日、あなたが完了したタスク一覧",
    "Backlog": "<Backlog> 本日、あなたが作成したタスク一覧"
  };
  const messageTitle = sectionMessages[sectionName];
  let message = `${sectionEmoji} *${messageTitle}* <@${slackUserId}>\n`;

  tasks.forEach((task, index) => {
    message += `>${index + 1}. <${task.permalink_url}|${task.name}> \n`;
  });

  const payload = {
    "channel": channelId,
    "text": message,
    "link_names": true,
    "mrkdwn": true
  };

  UrlFetchApp.fetch(baseUrl + "/chat.postMessage", {
    method: "POST",
    headers: header,
    payload: JSON.stringify(payload)
  });
}

function main() {

  const scriptProperties = PropertiesService.getScriptProperties();

  const asanaProjectId = scriptProperties.getProperty("ASANA_PROJECT_ID");
  const asanaAccessToken = scriptProperties.getProperty("ASANA_ACCESS_TOKEN");
  const asanaProjectSectionNames = ["Backlog", "In Progress", "Done"];

  const slackUsername = scriptProperties.getProperty("SLACK_USERNAME");
  const slackBotToken = scriptProperties.getProperty("SLACK_BOT_TOKEN");
  const slackChannelName = scriptProperties.getProperty("SLACK_CHANNEL_NAME");
  
  const slackUserId = getUserIdFromUsername(slackUsername, slackBotToken);

  asanaProjectSectionNames.forEach((sectionName, index) => {
    if (index > 0) {
      // Add a delay of 2 seconds between each section notification to avoid rate limits
      Utilities.sleep(2000);
    }

    const tasks = getAsanaTasks(asanaProjectId, sectionName, asanaAccessToken);
    sendToSlack(tasks, sectionName, slackUserId, slackBotToken, slackChannelName);
  });
}
