import { Injectable, Injector } from '@angular/core';
import { LogService } from './log.service';
import { CharacterService } from '../game-state/character.service';
import { MainLoopService } from './main-loop.service';
import { ReincarnationService } from './reincarnation.service';
import { ActivityService } from './activity.service';
import { BattleService } from './battle.service';

export enum ImpossibleTaskType {
  Swim,
  RaiseIsland,
  BuildTower,
  TameWinds,
  LearnToFly,
  BefriendDragon,
  ConquerTheWorld,
  RearrangeTheStars,
  OvercomeDeath
}

export interface ImpossibleTask {
  name: string,
  description: string,
  taskType: ImpossibleTaskType,
  progressRequired: number,
}

export interface ImpossibleTaskProgress {
  progress: number, 
  complete: boolean
}

export interface ImpossibleTaskProperties {
  taskProgress: ImpossibleTaskProgress[],
  impossibleTasksUnlocked: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ImpossibleTaskService {

  activityService?: ActivityService;
  impossibleTasksUnlocked: boolean = false;
  activeTaskIndex: number = -1;
  nextTask: number = 0;

  tasks: ImpossibleTask[] = [
    {
      name: "Swim to the bottom of the ocean",
      description: "You find a scrap in an ancient text that leads you to believe that the secret of immortality lies buried deep beneath the ocean's currents.",
      taskType: ImpossibleTaskType.Swim,
      progressRequired: 100000,
    },
    {
      name: "Raise an island from the sea",
      description: "At the bottom of the ocean you find a sunken island full of mystical wonders. Some of them will certainly help you in your quest for immortality, but they look too fragile to move by themselves. You'll need to pull the entire island to the surface.",
      taskType: ImpossibleTaskType.RaiseIsland,
      progressRequired: 10000,
    },
    {
      name: "Build a tower past the heavens",
      description: "The undersea wonders point you to a secret shrine high above the clouds. You'll need to build an impossibly tall tower to reach it.",
      taskType: ImpossibleTaskType.BuildTower,
      progressRequired: 1000,
    },
    {
      name: "Tame the winds",
      description: "The entrance to the shrine is sealed by a fierce hurricane that never stops blowing. You'll need to defeat the power of the storm to get in.",
      taskType: ImpossibleTaskType.TameWinds,
      progressRequired: 1000,
    },
    {
      name: "Learn to fly",
      description: "A carving in the sky shrine shows you that the ancient dragons have the secret of immortality. The dragons never fly where mortals can reach them, but fortunately the shrine contains an inscription that teaches you the fundamentals of flight.",
      taskType: ImpossibleTaskType.LearnToFly,
      progressRequired: 8888,
    },
    {
      name: "Befriend a dragon",
      description: "You fly far and wide across the world and finally find an ancient dragon. You'll need to convince it to speak with you to get any secrets from it.",
      taskType: ImpossibleTaskType.BefriendDragon,
      progressRequired: 5000,
    },
    {
      name: "Conquer the world",
      description: "The dragon finally relents and allows you to speak with it. It shows you the fighting and suffering in the mortal realm and says the situation is most displeasing. Before he will help you, he wants you to solve the problem. Guess it's time to conquer the world and set all things right.",
      taskType: ImpossibleTaskType.ConquerTheWorld,
      progressRequired: 100,
    },
    {
      name: "Rearrange the stars",
      description: "The dragon smiles approvingly and teaches you the secrets of drawing power from the heavens. You could perform the ritual to achieve immortality now if the stars were properly aligned, but that won't happen again for billions of years. Maybe you could help it along.",
      taskType: ImpossibleTaskType.RearrangeTheStars,
      progressRequired: 10000,
    },
    {
      name: "Overcome death itself",
      description: "The stars are aligned, the power to achieve immortality is finally within your grasp. The only thing you need to do now is use it to defeat death.",
      taskType: ImpossibleTaskType.OvercomeDeath,
      progressRequired: 1,
    },
  ];

  taskProgress: ImpossibleTaskProgress[] = [
    {
      progress: 0,
      complete: false,
    },
    {
      progress: 0,
      complete: false,
    },
    {
      progress: 0,
      complete: false,
    },
    {
      progress: 0,
      complete: false,
    },
    {
      progress: 0,
      complete: false,
    },
    {
      progress: 0,
      complete: false,
    },
    {
      progress: 0,
      complete: false,
    },
    {
      progress: 0,
      complete: false,
    },
    {
      progress: 0,
      complete: false,
    },
  ];

  constructor(
    private injector: Injector,
    private logService: LogService,
    private characterService: CharacterService,
    mainLoopService: MainLoopService,
    reincarnationService: ReincarnationService,
    private battleService: BattleService
  ) {

    mainLoopService.longTickSubject.subscribe(() => {
      if (this.nextTask >= this.tasks.length){
        // all tasks done
        return;
      }
      for (let i = 0; i < this.tasks.length; i++){
        if (this.taskProgress[i].complete && this.tasks[i].taskType == this.nextTask){
          this.nextTask++;
          return;
        }
      }
    });

    reincarnationService.reincarnateSubject.subscribe(() => {
      this.reset();
    });

  }

  reset(){
    for (let taskIndex = 0; taskIndex < this.tasks.length; taskIndex++){
      if (this.taskProgress[taskIndex].progress < this.tasks[taskIndex].progressRequired){
        this.taskProgress[taskIndex].progress = 0;
      }
    }
    this.activeTaskIndex = -1;
  }

  getProperties(): ImpossibleTaskProperties {
    return {
      taskProgress: this.taskProgress,
      impossibleTasksUnlocked: this.impossibleTasksUnlocked
    }
  }

  setProperties(properties: ImpossibleTaskProperties) {
    this.taskProgress = properties.taskProgress || [
      {
        progress: 0,
        complete: false,
      },
      {
        progress: 0,
        complete: false,
      },
      {
        progress: 0,
        complete: false,
      },
      {
        progress: 0,
        complete: false,
      },
      {
        progress: 0,
        complete: false,
      },
      {
        progress: 0,
        complete: false,
      },
      {
        progress: 0,
        complete: false,
      },
      {
        progress: 0,
        complete: false,
      },
      {
        progress: 0,
        complete: false,
      },
    ];
    this.impossibleTasksUnlocked = properties.impossibleTasksUnlocked;
  }

  checkCompletion(){
    if (this.activeTaskIndex < 0){
      return;
    }
    if (this.taskProgress[this.activeTaskIndex].progress >= this.tasks[this.activeTaskIndex].progressRequired){
      this.taskProgress[this.activeTaskIndex].complete = true;
      this.stopTask();
    }
  }

  startTask(){
    this.activeTaskIndex = this.nextTask;
    if (!this.activityService){
      this.activityService = this.injector.get(ActivityService);
    }
    this.activityService.reloadActivities();
    if (this.activeTaskIndex == ImpossibleTaskType.OvercomeDeath){
      this.battleService.addEnemy(this.battleService.enemyRepo.death);
    }
  }

  stopTask(){
    if (this.activeTaskIndex == ImpossibleTaskType.Swim){
      // back to the surface with you!
      this.taskProgress[this.activeTaskIndex].progress = 0;
    }
    this.activeTaskIndex = -1;
    if (!this.activityService){
      this.activityService = this.injector.get(ActivityService);
    }
    this.activityService.reloadActivities();
  }

}
