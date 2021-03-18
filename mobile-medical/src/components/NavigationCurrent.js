let navigationCurrent = {};
const NavigationCurrent = {
  get: () => navigationCurrent,
  set: (route) => {
    navigationCurrent = route;
  },
};
export { NavigationCurrent };
