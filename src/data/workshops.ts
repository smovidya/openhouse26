class Time {
  #hour: number;
  #minute: number;

  constructor(hour: number, minute: number) {
    this.#hour = hour;
    this.#minute = minute;
  }
}

interface Period {
  start: Time,
  end: Time;
  afternoon: boolean;
}


interface Workshop {
  id: number;
  departmentId: number;
  name: string;
  description: string;
  maxParticipant: number;
  rounds: Period[];
}

