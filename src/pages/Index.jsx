import React, { useState, useEffect } from "react";
import { Box, Button, Container, Flex, Heading, Input, List, ListItem, Text, useToast, VStack } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const fetchedEvents = await client.getWithPrefix("event:");
    if (fetchedEvents) {
      setEvents(fetchedEvents.map((e) => ({ id: e.key, ...e.value })));
    }
    setLoading(false);
  };

  const handleAddEvent = async () => {
    if (!newEvent.trim()) return;
    const key = `event:${Date.now()}`;
    const success = await client.set(key, { name: newEvent });
    if (success) {
      setEvents([...events, { id: key, name: newEvent }]);
      setNewEvent("");
      toast({
        title: "Event added.",
        description: "We've added your event.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteEvent = async (id) => {
    const success = await client.delete(id);
    if (success) {
      setEvents(events.filter((event) => event.id !== id));
      toast({
        title: "Event deleted.",
        description: "We've deleted your event.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent.name.trim()) return;
    const success = await client.set(editingEvent.id, { name: editingEvent.name });
    if (success) {
      const updatedEvents = events.map((event) => (event.id === editingEvent.id ? { ...event, name: editingEvent.name } : event));
      setEvents(updatedEvents);
      setEditingEvent(null);
      toast({
        title: "Event updated.",
        description: "We've updated your event.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" p={4}>
      <VStack spacing={4} align="stretch">
        <Heading mb={4}>Event Manager</Heading>
        <Flex>
          <Input placeholder="Add new event" value={newEvent} onChange={(e) => setNewEvent(e.target.value)} />
          <Button leftIcon={<FaPlus />} ml={2} onClick={handleAddEvent} colorScheme="teal">
            Add
          </Button>
        </Flex>
        <List spacing={3}>
          {events.map((event) => (
            <ListItem key={event.id} p={2} shadow="md">
              {editingEvent?.id === event.id ? (
                <Flex>
                  <Input value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
                  <Button ml={2} onClick={handleEditEvent} colorScheme="blue">
                    Save
                  </Button>
                </Flex>
              ) : (
                <Flex justify="space-between" align="center">
                  <Text>{event.name}</Text>
                  <Box>
                    <Button size="sm" mr={2} onClick={() => setEditingEvent({ id: event.id, name: event.name })} colorScheme="yellow">
                      <FaEdit />
                    </Button>
                    <Button size="sm" onClick={() => handleDeleteEvent(event.id)} colorScheme="red">
                      <FaTrash />
                    </Button>
                  </Box>
                </Flex>
              )}
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;
