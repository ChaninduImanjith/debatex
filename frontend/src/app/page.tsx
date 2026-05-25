"use client";

import { useEffect, useState } from "react";

import { socket } from "../lib/socket";

export default function Home() {
  const [roomId, setRoomId] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<string[]>([]);

  useEffect(() => {
    socket.on(
      "receive_message",
      (data: string) => {
        setMessages((prev) => [
          ...prev,
          data,
        ]);
      }
    );

    return () => {
      socket.off(
        "receive_message"
      );
    };
  }, []);

  const joinRoom = () => {
    socket.emit(
      "join_room",
      roomId
    );
  };

  const sendMessage = () => {
    socket.emit("send_message", {
      roomId,
      message,
    });

    setMessage("");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        DebateX Rooms
      </h1>

      <div className="mt-5">
        <input
          placeholder="Room ID"
          value={roomId}
          onChange={(e) =>
            setRoomId(e.target.value)
          }
          className="border p-2"
        />

        <button
          onClick={joinRoom}
          className="bg-blue-500 text-white px-4 py-2 ml-2"
        >
          Join Room
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-blue-600 text-white p-2 rounded"
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="border p-2"
          placeholder="Message"
        />

        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}