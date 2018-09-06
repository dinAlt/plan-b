describe("Planner lastExecuted", function () {
  beforeAll(function (done) {
    planB.plan([
      {
        name: "lastExecuted_zero",
        actions: [function () { }],
        triggers: [{ on: "init", timeout: 1000 }]
      },
      {
        name: "lastExecuted_once",
        actions: [function () { }],
        triggers: [{ on: "init" }]
      },
    ])
    setTimeout(done, 200);
  }, 5000)

  it("should be undefined", function() {
    expect(planB.lastExecuted("lastExecuted_zero")).toBeUndefined();
  });

  it("should returns date", function() {
    expect(planB.lastExecuted("lastExecuted_once").getTime()).toBeGreaterThan(0);
  });
});

describe("Planner timeout and repeat", function () {
  var countZero = 0
  var countOnce = 0;
  var countTwice = 0;
  var countTriple = 0;
  beforeAll(function (done) {
    planB.plan([
      {
        name: "zero",
        actions: [function () { countZero++; }],
        triggers: [{ on: "init", timeout: 400 }]
      },
      {
        name: "once",
        actions: [function () { countOnce++; }],
        triggers: [{ on: "init" }]
      },
      {
        name: "twice",
        actions: [function () { countTwice++; }],
        triggers: [{ on: "init", timeout: 120, repeat: 120 }]
      },
      {
        name: "triple",
        actions: [function () { countTriple++; }],
        triggers: [{ on: "init", repeat: 120 }]
      },
    ]);
    setTimeout(done, 300)
  }, 5000);
  it("should not fire", function () {
    expect(countZero).toBe(0);
  });
  it("should fire once", function () {
    expect(countOnce).toBe(1);
  });
  it("should fire twice", function () {
    expect(countTwice).toBe(2);
  });
  it("should fire three times", function () {
    expect(countTriple).toBe(3);
  });
});

describe("Planner plan", function () {
  var countOnce = 0;
  var countTwice = 0;
  var countTwiceWithSecondPlan = 0;
  var countTwiceWith2SecondPlan = 0;

  beforeAll(function (done) {
    planB.plan([
      {
        name: "plan_once",
        actions: [function () { countOnce++; }],
        triggers: [{ on: "init", plan: "once" }]
      },
    ]);

    setTimeout(function () {
      planB.plan([
        {
          name: "plan_once",
          actions: [function () { countOnce++; }],
          triggers: [{ on: "init", plan: "once" }]
        },
      ]);
    }, 100);

    planB.plan([
      {
        name: "plan_twice",
        actions: [function () { countTwice++; }],
        triggers: [{ on: "init" }]
      },
    ]);

    setTimeout(function () {
      planB.plan([
        {
          name: "plan_twice",
          actions: [function () { countTwice++; }],
          triggers: [{ on: "init" }]
        },
      ]);
    }, 100)

    planB.plan([
      {
        name: "plan_twice_with_second",
        actions: [function () { countTwiceWithSecondPlan++; }],
        triggers: [{ on: "init", plan: "second" }]
      },
    ]);

    setTimeout(function () {
      planB.plan([
        {
          name: "plan_twice_with_second",
          actions: [function () { countTwiceWithSecondPlan++; }],
          triggers: [{ on: "init", plan: "second" }]
        },
      ]);
    }, 500);

    setTimeout(function () {
      planB.plan([
        {
          name: "plan_twice_with_second",
          actions: [function () { countTwiceWithSecondPlan++; }],
          triggers: [{ on: "init", plan: "second" }]
        },
      ]);
    }, 1200);

    planB.plan([
      {
        name: "plan_twice_with_2_second",
        actions: [function () { countTwiceWith2SecondPlan++; }],
        triggers: [{ on: "init", plan: [2, "second"] }]
      },
    ]);

    setTimeout(function () {
      planB.plan([
        {
          name: "plan_twice_with_2_second",
          actions: [function () { countTwiceWith2SecondPlan++; }],
          triggers: [{ on: "init", plan: [2, "second"] }]
        },
      ]);
    }, 1200);

    setTimeout(function () {
      planB.plan([
        {
          name: "plan_twice_with_2_second",
          actions: [function () { countTwiceWith2SecondPlan++; }],
          triggers: [{ on: "init", plan: [2, "second"] }]
        },
      ]);
    }, 2200);

    setTimeout(done, 2500)
  }, 5000);

  it("with once should fire once", function () {
    expect(countOnce).toBe(1);
  });

  it("with no plan should fire twice", function () {
    expect(countTwice).toBe(2);
  });

  it("with second plan should fire twice", function () {
    expect(countTwiceWithSecondPlan).toBe(2);
  });

  it("with two seconds plan should fire twice", function () {
    expect(countTwiceWith2SecondPlan).toBe(2);
  });
});

describe("Planner check", function () {
  var countOnce = 0;
  var countZero = 0
  beforeAll(function (done) {
    planB.plan([
      {
        name: "check_zero",
        actions: [function () { countZero++; }],
        triggers: [{ on: "init", check: function (task) { return task === "check_once" } }]
      },
      {
        name: "check_once",
        actions: [function () { countOnce++; }],
        triggers: [{ on: "init", check: function (task) { return task === "check_once" } }]
      },
    ]);

    setTimeout(done, 300)
  }, 5000);

  it("should not fire", function () {
    expect(countZero).toBe(0);
  });

  it("should fire once", function () {
    expect(countOnce).toBe(1);
  });
});