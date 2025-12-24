module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/', '/about', '/posts'],
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
