const {models} = require("../../sequelize");
const {TagNotUpdatedError} = require("../../sequelize/errors/tag/tagErrors");

const create_tag = async (req, res) => {
    const {tagName, serverIds} = req.body;
    try {
        const createdTag = await models.tag.createWithName({
            tagName: tagName,
            serverIds: serverIds
        });
        res.send({
            status: "success",
            messages: [{
                text: `Тэг ${createdTag.name} успешно добавлен!`
            }],
            tag: createdTag
        });
    } catch (e) {
        res.send({
            status: "warning",
            message: e.message,
            messages: e.messages
        });
    }
}

const edit_tag = async (req, res) => {
    const {name, color, serverIds} = req.body;
    const tagId = req.params.tagId;
    try {
        let tagToEdit = await models.tag.findByPk(tagId);
        await tagToEdit.editTag({tagId, name, color, serverIds});
        res.send({
            status: "success",
            messages: [{
                text: `Тэг ${tagToEdit.name} успешно отредактирован!`
            }],
            tag: tagToEdit
        });
    } catch (e) {
        if (e instanceof TagNotUpdatedError){
            res.send({
                status: "info",
                messages: e.messages
            });
        } else {
            res.send({
                status: "warning",
                messages: e.messages
            });
        }
    }
}

const retrieveTagById = async (req, res) => {
    const tagId = req.params.tagId;
    try {
        const tag = await models.tag.retrieveTag({tagId: tagId});
        res.send({
           status: "success",
           tag: tag
        });
    } catch (e) {
        res.send({
           status: "warning",
           messages: e.messages
        });
    }
}

const retrieve_tags_by_name = async (req, res) => {
    res.send({
        status: "success",
        tagsByName: await models.tag.retrieveTagsByName({tagName: req.query.tagName})
    });
}

const retrieveAllTags = async (req, res) => {
    res.send({
        status: "success",
        tags: await models.tag.retrieveAllTags()
    });
}

const setServers = async (req, res) => {
    const tagId = req.params.tagId;
    const serverIds = req.body.serverIds;
    try {
        const tag = await models.tag.findByPk(tagId);
        const newServers = await models.server.findAll({
            where: {
                id: serverIds
            }
        });
        tag.setServers(newServers);
        res.send({
            status: "success",
            messages: [{
                text: `Сервера успешно добавлены в тэг ${tag.name}!`
            }],
            tag: tag
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.message
        });
    }
}

const delete_tag = async (req, res) => {
    const tagId = req.params.tagId;
    try {
        const deletedTagCount = await models.tag.deleteTag({tagId});
        res.send({
            status: "success",
            messages: [{
               text: "Сервер успешно удален!"
            }],
            deletedTagCount: deletedTagCount
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.message
        });
    }
}

module.exports = {
    create_tag,
    retrieveTagById,
    retrieve_tags_by_name,
    retrieveAllTags,
    edit_tag,
    setServers,
    delete_tag
}