import express from "express";

import * as MSGraph from "./graph";
import * as Template from "./template";

import * as User from "./User";

import Config from "./config";

const server = express();

const ms_graph = MSGraph.make();

server
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .get("/", async (req, res, next) => {
    res.send(
      Template.layout(`<h2 class="text-xl text-gray-200"> Find user </h2>
      ${Template.user_input("/find_user", "Find user")}`)
    );
  })
  .post("/find_user", async (req, res) => {
    const users = await ms_graph
      .get_user_by_upn(req.body.user_id)
      .catch((error) => {
        console.log(error);
        return { value: [] as User.t[] };
      });

    const auth_methods = await Promise.all(
      users.value.map((user) => {
        return ms_graph.get_auth_methods(user.id);
      })
    ).catch((e) => {
      console.error(e);
      return [];
    });

    res.send(
      Template.layout(Template.users_form(req.body.user_id, users.value))
    );
  })
  .post("/enable_user", async (req, res) => {
    const enable_result = await ms_graph
      .enable_user_by_id(req.body.user_id)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((e) => {
        console.log(e);
        return null;
      });

    if (enable_result === null) {
      return res
        .status(500)
        .send(Template.layout(Template.user("Could not enable user")));
    }

    return ms_graph
      .get_user_by_id(req.body.user_id)
      .then((user) => res.send(Template.layout(Template.user(user))))
      .catch((e) => {
        console.log(e);
        res.status(500).send(Template.layout(Template.user(e)));
      });
  })
  .post("/disable_user", async (req, res) => {
    const disable_result = await ms_graph
      .disable_user_by_id(req.body.user_id)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((e) => {
        console.log(e);
        return null;
      });

    if (disable_result === null) {
      return res
        .status(500)
        .send(Template.layout(Template.user("Could not enable user")));
    }

    return ms_graph
      .get_user_by_id(req.body.user_id)
      .then((user) => res.send(Template.layout(Template.user(user))))
      .catch((e) => {
        console.log(e);
        res.status(500).send(Template.layout(Template.user(e)));
      });
  })
  .listen(Config.PORT, () => console.info(`Listening on port: ${Config.PORT}`));
