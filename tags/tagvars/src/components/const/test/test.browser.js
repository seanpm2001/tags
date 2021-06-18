const { expect, use } = require("chai");
const { render, screen, fireEvent } = require("@marko/testing-library");
const Basic = require("./fixtures/basic.marko").default;
const Destructuring = require("./fixtures/destructuring.marko").default;
const InputDerived = require("./fixtures/input-derived.marko").default;
const StateDerived = require("./fixtures/state-derived.marko").default;
const ErrorMutation = require("./fixtures/error-mutation.marko").default;

use(require("chai-dom"));
use(require("chai-as-promised"));

describe("browser", () => {
  it("basic", async () => {
    await render(Basic);
    expect(screen.getByText("Hi John")).to.exist;
  });

  it("destructuring", async () => {
    await render(Destructuring);
    expect(screen.getByText("apples oranges bananas")).to.exist;
    expect(screen.getByText("George R.R. Martin")).to.exist;
  });

  it("input derived", async () => {
    const { rerender } = await render(InputDerived, { value: 1 });
    expect(screen.getByText("1 x 2 = 2")).to.exist;
    await rerender({ value: 2 });
    expect(screen.getByText("2 x 2 = 4")).to.exist;
  });

  it("state derived", async () => {
    await render(StateDerived, { value: 1 });
    expect(screen.getByText("1 x 2 = 2")).to.exist;
    await fireEvent.click(screen.getByText("increment"));
    expect(screen.getByText("2 x 2 = 4")).to.exist;
  });

  it("error mutation", async () => {
    await expect(render(ErrorMutation)).to.be.rejectedWith(
      "Cannot add property fullName"
    );
  });
});