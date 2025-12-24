module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/index.html', '/about.html', '/posts.html'],
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
