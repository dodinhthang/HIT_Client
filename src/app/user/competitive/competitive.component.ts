import { Component, OnInit, Input, Inject,ViewChild } from '@angular/core';
import { PlayService } from '../../services/play.service';
import { SocketService } from '../../socket/socket.service';
import { ProblemService } from '../../services/problem.service';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-competitive',
  templateUrl: './competitive.component.html',
  styleUrls: ['./competitive.component.scss'],
  providers: [PlayService, SocketService, ProblemService]
})
export class CompetitiveComponent implements OnInit {
  @ViewChild('fileInput')myInputVariable;
  arrayInput = [];
  arrayOutput = [];
  status = undefined;
  panelOpenState: boolean = true;
  listQ; //Danh sách câu hỏi
  listP; //Danh sách câu hỏi lập trình
  dem = 0;
  selectedQuestion; // Câu hỏi được lựa chọn
  selectIndex = 0; // Vị trí câu hỏi được lựa chọn
  fullPlay = null; // Thông tin của vòng chơi
  time; // thời gian còn lại của người chơi
  preTime; //Interval Time

  timeDis = {
    minute: 0,
    seconds: 0
  };
  updateRef;
  selectedProblem;
  fileToUpload: File = null;
  studentId;
  loading = false;
  constructor(private play: PlayService, public proService: ProblemService, public socket: SocketService,private snackbar:MatSnackBar) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.studentId = localStorage.getItem('studentId');
    this.socket.onLogin().subscribe(message => {
      this.socket.login({
        command: 1000,
        token: token
      });
    });
    this.play.GetQuestion(this.studentId).then(result => {
      console.log(result);
      if (result.data.status == 0 || result.data.status == 1) {
        this.fullPlay = result;
        this.time = result.data.time;
        this.listQ = result.data.history.questions;
        this.selectedQuestion = result.data.history.questions[0];
        this.listP = result.data.history.problems;
        this.status = true;
        // console.log(this.listP)
        this.run();
      } else {
        this.status = false;
      }
    });
  }
  run() {
    const self = this;
    clearInterval(this.preTime);
    this.preTime = setInterval(function() {
      if (self.time > 0) {
        self.time--;
        let minute = Math.floor(self.time / 60) ? Math.floor(self.time / 60) : 0;
        let seconds = self.time - minute * 60;
        self.timeDis = {
          minute: minute,
          seconds: seconds
        };
      }
      if (self.time >= 0) {
        self.socket.emitAnswer({ comand: 2000, data: self.fullPlay, time: self.time });
      }
      if (self.time == 0) {
        clearInterval(self.preTime);
        self.socket.emitAnswer({ comand: 3000, studentId: self.studentId });
      }
      if (self.time <= 0) {
        clearInterval(self.preTime);
      }
    }, 1000);
  }
  // Style

  ///
  //Chọn câu hỏi
  onSelect(quest, i) {
    this.selectIndex = i;
    this.selectedQuestion = quest;
    this.selectedProblem = null;
  }
  //Câu hỏi trước
  Last() {
    if (this.selectIndex != 0) {
      this.selectedQuestion = this.listQ[--this.selectIndex];
    }
  }
  //Câu hỏi tiếp theo
  Next() {
    if (this.selectIndex != this.listQ.length - 1) {
      this.selectedQuestion = this.listQ[++this.selectIndex];
    }
  }
  //Chọn câu hỏi
  onSelectProblem(problem, i) {
    this.selectIndex = i;
    this.selectedProblem = problem;
    this.selectedQuestion = null;
    console.log(this.selectedProblem);
  }
  setButton() {
    if (this.selectIndex == 0) {
      return 1;
    } else if (this.selectIndex != this.listQ.length - 1) {
      return 3;
    } else {
      return 2;
    }
  }
  //Chọn câu trả lời
  SelectAns(event) {
    this.selectedQuestion.answer = event.target.innerText;
    this.selectedQuestion.answered = true;
    this.fullPlay.data.time = this.time;
    this.fullPlay.comand = 1000;
    this.socket.emitAnswer(this.fullPlay);
    this.socket.onQuestion().subscribe(result => {
      if (result.data.status == 0 || result.data.status == 1) {
        this.fullPlay = result;
        this.time = result.data.time;
        this.listQ = result.data.history.questions;
        // this.selectedQuestion = result.data.history.questions[0];
        this.listP = result.data.history.problems;
        this.status = true;
        // this.run();
      } else {
        this.status = false;
      }
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.myInputVariable.nativeElement.value = '';

    this.uploadFileToActivity();

  }
  uploadFileToActivity() {
    this.loading = true;
    this.proService.postFile(this.fileToUpload, this.selectedProblem.problemId.sortName).then(result => {

      if (result.status == '200') {
        this.listP = result.data;
        if(result.correct==true){
          this.openSnackBar('Chúc mừng bạn đã làm chính xác','Đóng');
        }else{
          this.openSnackBar('Bạn đã làm sai','Đóng');
        }
      }else{
        this.openSnackBar('Lỗi biên dịch ','Đóng');
      }
      this.fileToUpload = null;
      this.loading = false;
    })
  }
  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 4000
    });
  }
}
