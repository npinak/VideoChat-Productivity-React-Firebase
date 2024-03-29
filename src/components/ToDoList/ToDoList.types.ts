type localParticipant = {
  name: string;
  id: string;
  isLocal: boolean;
};

export type localParticipantToDo = {
  id: number;
  content: string;
  complete: boolean;
};

export type Props = {
  localParticipant: localParticipant;
  localParticipantToDoList: [localParticipantToDo];
};
