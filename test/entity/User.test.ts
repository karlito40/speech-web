import bootstrap from "../../src/bootstrap";
import { getRepository } from "typeorm";
import { User } from "../../src/entities/User";
import assert from "assert";
import faker from "faker";
import { validate } from "class-validator";
import { createEntity } from "../../src/lib/entity";
import { log } from "../../src/lib/logger";

let app, userRepository;
beforeAll(async () => {
  app = await bootstrap();
  userRepository = getRepository(User);
  return;
});

describe("User", () => {
  it("should be able to create and update a user", async (done) => {
    const user = new User();
    await user.setPassword("test-password");
    user.pseudo = faker.internet.userName();
    user.email = faker.internet.email();

    const errors = await validate(user);
    assert.ok(!errors.length);

    const insertedUser = await userRepository.save(user);
    assert.equal(user.email, insertedUser.email);
    assert.ok(await insertedUser.comparePassword("test-password"));
    assert.ok(insertedUser.createdAt);
    assert.ok(insertedUser.updatedAt);

    const updatedAt = insertedUser.updatedAt;
    insertedUser.pseudo = faker.internet.userName();
    const updatedUser = await userRepository.save(user);
    assert.ok(updatedUser.updatedAt != updatedAt);
      done();
  });

  it("should return an array of error", async (done) => {
    // invalid email + invalid pseudo
    const user = createEntity(User, {
      email: "invalidemail",
      password: "totototo",
    });
    const errors = await validate(user);
    assert.ok(errors.length > 0);

    done();
  });

  it("should return an error with an invalid email", async (done) => {
    let user = createEntity(User, {
      email: "invalidemail",
      pseudo: "pseudo",
      password: "totototo",
    });
    let errors = await validate(user);
    assert.equal(errors.length, 1);

    user = createEntity(User, {
      pseudo: "pseudo",
      password: "totototo",
    });
    errors = await validate(user);
    assert.equal(errors.length, 1);

    done();
  });

  it("should return an error with a bad pseudo", async (done) => {
    let user = createEntity(User, {
      email: "toto@toto.com",
      password: "totototo",
    });
    let errors = await validate(user);
    assert.equal(errors.length, 1);

    user = createEntity(User, {
      email: "toto@toto.com",
      pseudo: "12",
      password: "totototo",
    });
    errors = await validate(user);
    assert.equal(errors.length, 1);

    user = createEntity(User, {
      email: "toto@toto.com",
      pseudo: "123",
      password: "totototo",
    });
    errors = await validate(user);
    assert.ok(!errors.length);

    done();
  });


});