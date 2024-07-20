"use strict";

const { CustomError } = require("../errors/customError");
const Tag = require("../models/tagModel");
const Task = require("../models/taskModel");

module.exports = {
  // GET
  listTags: async (req, res) => {
    /*
      - Determines the filter based on whether the requesting user (req.user) is an admin.
      - If the user is not an admin, sets the filter to only include tags owned by the user.
      - Fetches the list of tags from the database using the filter.
      - Sends the fetched tags in the response with a 200 status code.
    */
    let listFilter = {};

    if (!req.user.isAdmin) {
      listFilter.userId = req.user?._id || req.user?.id;
    }

    const tags = await res.getModelList(Tag, listFilter);
    res.status(200).send({ error: false, data: tags });
  },
  // /:id => GET
  listTagTasks: async (req, res) => {
    /*
      - Sets the filter to fetch tasks associated with a specific tag ID.
      - If the user is not an admin, adds a condition to the filter to only include tasks owned by the user.
      - Fetches the list of tasks from the database using the filter.
      - Sends the fetched tasks and additional details in the response.
    */
    const listFilter = {
      tagId: req.params.id,
    };

    if (!req.user.isAdmin) {
      listFilter.userId = req.user?._id || req.user?.id;
    }

    const tasks = await res.getModelList(Task, listFilter);
    // .sort({ priority: -1 }); // from high to low priority
    res.send({
      error: false,
      details: await res.getModelListDetails(Task, listFilter),
      data: tasks,
    });
  },
  // POST
  createTag: async (req, res) => {
    /*
      - Extracts the tag name from the request body.
      - Creates a new tag with the extracted name and the user ID of the requesting user.
      - Saves the new tag to the database.
      - Sends a response indicating the success of the creation operation with a 201 status code.
    */
    const { name } = req.body;

    const userId = req.user.isAdmin
      ? req.body.userId // userId must be provided in the request body by an admin
      : req.user?._id || req.user?.id;

    const existingName = await Tag.findOne({ name, userId });

    if (existingName) {
      throw new CustomError("Tag already exists", 403);
    }

    const tag = new Tag({ name, userId });
    await tag.save();
    res.status(201).send({
      error: false,
      message: "New Tag successfully created",
      data: tag,
    });
  },
  // /:id => GET
  readTag: async (req, res) => {
    /*
      - Tries to find the tag by ID from the database.
      - Checks if the tag exists and if the requesting user is the owner of the tag or an admin.
      - Sends the tag data in the response with a 200 status code if the tag is found and the user is authorized.
      - If the tag is not found or the user is not authorized, sends a 404 status code with a "Tag not found" message.
    */
    const tag = await Tag.findOne({ _id: req.params.id });
    res.status(200).send({ error: false, data: tag });
  },
  // /:id => PUT/PATCH
  updateTag: async (req, res) => {
    /*
      - Tries to find the tag by ID from the database.
      - Checks if the tag exists and if the requesting user is the owner of the tag or an admin.
      - Updates the tag name if provided in the request body.
      - Saves the updated tag to the database.
      - Sends a response indicating the success of the update operation with a 200 status code.
      - If the tag is not found or the user is not authorized, sends a 404 status code with a "Tag not found" message.
    */
    const tag = await Tag.updateOne({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(tag.modifiedCount ? 202 : 404).send({
      error: !tag.modifiedCount,
      message: tag.modifiedCount ? "Tag successfully updated" : "Tag not found",
      new: tag,
    });
  },
  // /:id => DELETE
  destroyTag: async (req, res) => {
    /*
      - Tries to find the tag by ID from the database.
      - Checks if the tag exists and if the requesting user is the owner of the tag or an admin.
      - Deletes the tag from the database.
      - Sends a response indicating the success of the deletion operation with a 200 status code.
      - If the tag is not found or the user is not authorized, sends a 404 status code with a "Tag not found" message.
    */
    const tag = await Tag.deleteOne({ _id: req.params.id });

    res.status(tag.deletedCount ? 204 : 404).send({
      error: !tag.deletedCount,
      message: tag.deletedCount ? "Tag successfully deleted" : "Tag not found",
    });
  },
};
