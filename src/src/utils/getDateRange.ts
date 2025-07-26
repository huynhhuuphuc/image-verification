const getFromDate = () => {
  const today = new Date();
  const fromDate = new Date(today.setDate(today.getDate() - 30));
  return fromDate.toISOString().split("T")[0];
};

const getToDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export { getFromDate, getToDate };
