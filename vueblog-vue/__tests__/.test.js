import router from "./router";

describe("router.beforeEach", () => {
  let originalLocalStorage;

  beforeAll(() => {
    originalLocalStorage = global.localStorage;
    global.localStorage = {
      getItem: jest.fn(),
    };
  });

  afterAll(() => {
    global.localStorage = originalLocalStorage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call next() when route doesn't require auth", () => {
    const to = { matched: [], path: "/public" };
    const from = {};
    const next = jest.fn();

    router.beforeEach(to, from, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  test("should redirect to login when auth is required but no token exists", () => {
    const to = {
      matched: [{ meta: { requireAuth: true } }],
      path: "/protected",
    };
    const from = {};
    const next = jest.fn();

    global.localStorage.getItem.mockReturnValue(null);

    router.beforeEach(to, from, next);

    expect(next).toHaveBeenCalledWith({ path: "/login" });
  });

  test("should call next() when auth is required and token exists", () => {
    const to = {
      matched: [{ meta: { requireAuth: true } }],
      path: "/protected",
    };
    const from = {};
    const next = jest.fn();

    global.localStorage.getItem.mockReturnValue("valid-token");

    router.beforeEach(to, from, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  test("should not redirect when on login page with token", () => {
    const to = {
      matched: [{ meta: { requireAuth: true } }],
      path: "/login",
    };
    const from = {};
    const next = jest.fn();

    global.localStorage.getItem.mockReturnValue("valid-token");

    router.beforeEach(to, from, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });
});
