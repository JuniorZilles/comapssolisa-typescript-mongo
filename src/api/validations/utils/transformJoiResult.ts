const transformToArray = (value: any) => {
  const result: any[] = [];
  value.details.forEach((detail: any) => {
    result.push({ name: detail.message, description: detail.path.join('.') });
  });
  return result;
};

export default transformToArray;
