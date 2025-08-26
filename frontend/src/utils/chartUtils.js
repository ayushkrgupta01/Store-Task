// utils/chartUtils.js

/**
 * Processes a data array and groups items by a specified time frame using a dynamic date field.
 * @param {Array<Object>} data The raw data array (e.g., stores or customers).
 * @param {string} timeFrame The time frame to group by ("day", "month", or "year").
 * @param {string} dateField The name of the field containing the creation date (e.g., "CreatedAt", "Customer_Date").
 * @returns {Array<Object>} An array of objects with 'name' (the date key) and 'count'.
 */
export const processDataByTimeFrame = (data, timeFrame, dateField) => {
  if (!data || data.length === 0) {
    return [];
  }

  const groupedData = {};

  data.forEach((item) => {
    // Dynamically access the date field
    const dateValue = item[dateField];
    if (!dateValue) {
      return; // Skip if no date is present
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return; // Skip invalid dates
    }

    let key;
    switch (timeFrame) {
      case "day":
        key = date.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
        break;
      case "month":
        key = date.toISOString().slice(0, 7); // Format: "YYYY-MM"
        break;
      case "year":
        key = date.getFullYear().toString(); // Format: "YYYY"
        break;
      default:
        return;
    }

    if (!groupedData[key]) {
      groupedData[key] = { name: key, count: 0 };
    }
    groupedData[key].count += 1;
  });

  return Object.values(groupedData).sort((a, b) => a.name.localeCompare(b.name));
};