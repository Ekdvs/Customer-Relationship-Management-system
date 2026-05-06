export const assignLeadToUser = (users) => {
  if (!users || users.length === 0) return null;

  // simple round-robin style assignment
  const index = Math.floor(Math.random() * users.length);
  return users[index]._id;
};