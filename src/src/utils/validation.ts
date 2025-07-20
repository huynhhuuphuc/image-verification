const formatJoinDate = (dateString: string) => {
  const date = new Date(dateString.split(".")[0]);

  const formatted = new Intl.DateTimeFormat("vi-VN").format(date);
  return formatted;
};

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export { formatJoinDate, emailPattern };
