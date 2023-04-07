function setScriptProperties() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("ASANA_PROJECT_ID", "<YOUR_ASANA_PROJECT_ID>");
  scriptProperties.setProperty("ASANA_ACCESS_TOKEN", "<YOUR_ASANA_ACCESS_TOKEN>");
  scriptProperties.setProperty("SLACK_USERNAME", "<YOUR_SLACK_USERNAME>");
  scriptProperties.setProperty("SLACK_BOT_TOKEN", "<YOUR_SLACK_BOT_TOKEN>");
  scriptProperties.setProperty("SLACK_CHANNEL_NAME", "<YOUR_SLACK_CHANNEL_NAME>");
}
