import {prisma} from "../lib/prisma.js"
async function createChat(req,res) {
    const { userId, selectedUser } = req.body;
    const currentUserId = Number(userId);
    const selectedUserId = Number(selectedUser);

    if (!Number.isInteger(currentUserId) || !Number.isInteger(selectedUserId)) {
      return res.status(400).json({ msg: "Invalid user ids" });
    }

     if (currentUserId === selectedUserId) {
    return res.status(400).json({ msg: "Cannot create chat with same user" });
  }
  const existingChat = await prisma.chat.findFirst({
    where: {
      AND: [
        { users: { some: { id: currentUserId } } },
        { users: { some: { id: selectedUserId } } },
      ],
    },
    include: {
      messages: true,
    },
  });

  if (existingChat) {
    return res.json({
      msg: "chat exists",
      chatId: existingChat.id,
      chatter: selectedUserId,
      messages: existingChat.messages,
    });
  }

  const created = await prisma.chat.create({
    data: {
      users: {
        connect: [{ id: currentUserId }, { id: selectedUserId }],
      },
    },
    include: {
      messages: true,
    },
  });
   return res.status(201).json({
    msg: "chat created",
    chatId: created.id,
    chatter: selectedUserId,
    messages: created.messages,
  });
}

export default {
    createChat
}