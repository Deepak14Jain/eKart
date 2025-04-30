module.exports = {
  env: {
    node: true, // Enable Node.js global variables and Node.js scoping
    es2021: true,
  },
  rules: {
    'no-undef': 'off', // Disable the rule that flags 'require' as undefined
  },
};
