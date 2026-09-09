export const analyticsEvents = {
  pageView: "page_view",
  toolView: "tool_view",
  fileSelected: "file_selected",
  processingStarted: "processing_started",
  processingCompleted: "processing_completed",
  processingFailed: "processing_failed",
  downloadClicked: "download_clicked",
  relatedToolClicked: "related_tool_clicked",
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];
