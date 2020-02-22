import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Sort, MatDialog, MatTableDataSource, PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatPaginator } from '@angular/material';
import { InterviewDialogComponent } from './interview-dialog/interview-dialog.component';
@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit {
  displayedColumns = ['position', 'name', 'studentId', 'birthDate', 'interviewScore', 'avgScore', 'phone', 'action'];
  dataSource;
  count = 0;
  updateRef;
  data = {
    total: 10,
    docs: []
  };
  sortedData = {
    total: 10,
    docs: []
  };
  pageEvent: PageEvent;
  pageIndex;
  currentPage = 1;
  currentLimit = 10;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  // tslint:disable-next-line:max-line-length
  constructor(private socket: SocketService, private router: Router, private user: UserService, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.SetData(1, 10);
    this.socket.onUpdateInterview().subscribe(result => {
      console.log(result);
      console.log(this.data.docs.findIndex(d => d.studentId === result.studentId));
      if (result.command === 1000) {
        this.data.docs[this.data.docs.findIndex(d => d.studentId === result.studentId)].playId.isInterviewing = true;
      }
      if (result.command === 1001) {
        this.data.docs[this.data.docs.findIndex(d => d.studentId === result.studentId)].playId.isInterviewing = false;
      }
      if (result.command === 1002) {
        this.data.docs[this.data.docs.findIndex(d => d.studentId === result.studentId)].playId.interviewScore = result.score;
      }
      this.dataSource = new MatTableDataSource<Object>(this.data.docs);
    });
  }
  // STYLE FUNCTION

  getRowStyle(element) {
    if (this.data.docs.indexOf(element) % 2 === 0) {
      return 'rgba(0,0,0,.001)';
    } else {
      return 'rgba(0,0,0,.03)';
    }
  }
  getAvgScore(playId) {
    return (playId.totalScore + playId.interviewScore) / 2;
  }
  getInterviewBtnStyle(element) {
    if (!element.playId) {
      // chưa thi
      return '#3b7dd8';
    }
    if (element.playId) {
      if (element.playId.isInterviewing === true) {
        if (element.playId.interviewScore !== 0) {
          // đã thi đã phỏng vấn
          return '#ee4035';
        } else {
          // đã thi - đang phỏng vấn
          return '#ffc425';
        }
      } else {
        // đã thi chưa phỏng vấn
        return '#7bc043';
      }
    }
  }
  getStatusText(element) {
    if (!element.playId) {
      // chưa thi
      return 'Chưa thi';
    }
    if (element.playId) {
      if (element.playId.isInterviewing === true) {
        if (element.playId.interviewScore !== 0) {
          // đã thi đã phỏng vấn
          return 'Đã phỏng vấn';
        } else {
          // đã thi - đang phỏng vấn
          return 'Đang phỏng vấn';
        }
      } else {
        // đã thi chưa phỏng vấn
        return 'Chưa phỏng vấn';
      }
    }
  }
  // getStatusIcon(element) {
  //   if (!element.playId) {
  //     // chưa thi
  //     return 'alarm_off';
  //   }
  //   if (element.playId) {
  //     if (element.playId.isInterviewing === true) {
  //       if (element.playId.interviewScore !== 0) {
  //         // đã thi đã phỏng vấn
  //         return 'mic_off';
  //       } else {
  //         // đã thi - đang phỏng vấn
  //         return 'record_voice_over';
  //       }
  //     } else {
  //       // đã thi chưa phỏng vấn
  //       return 'mic';
  //     }
  //   }
  // }
  canInterview(element) {
    if (element.playId && element.playId.isInterviewing === false) {
      return true;
    } else {
      return false;
    }
  }
  // END STYLE FUNCTION
  logOut() {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.socket) {
        this.socket.disconnect();
        this.socket.onDisconnect().subscribe(result => {});
      }
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
  }
  SetData(page, limit) {
    this.user.GetUsers(page, limit, undefined).then(result => {
      this.data = result.data;
      console.log(this.data);
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
    });
  }
  GetIndexPage(event) {
    this.user.GetUsers(event.pageIndex + 1, event.pageSize, undefined).then(result => {
      this.currentPage = event.pageIndex + 1;
      this.currentLimit = event.pageSize;
      this.data = result.data;
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
      this.dataSource.paginator = this.paginator;
    });
  }
  CheckEx(play) {
    if (play.status == 1) {
      return 'Đang thi';
    } else {
      return 'Đã thi';
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }
  showInterviewDialog(element) {
    this.socket.startInterview(element.studentId);
    const interviewData = {
      judgeName: '',
      studentName: element.name,
      score: undefined,
      playId: element.playId._id,
      content: ''
    };
    const dialogRef = this.dialog.open(InterviewDialogComponent, {
      width: '80%',
      height: '90%',
      data: interviewData,
      disableClose: true,
      panelClass: 'interview-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.socket.finishInterview(element.studentId, interviewData);
        const index = this.data.docs.findIndex(d => d.studentId === element.studentId);
        this.data.docs[index].playId.interviewScore = interviewData.score;
        this.data.docs[index].playId.isInterviewing = true;
      } else {
        this.socket.cancelInterview(element.studentId, interviewData);
        this.data.docs[this.data.docs.findIndex(d => d.studentId === element.studentId)].playId.isInterviewing = false;
      }
      this.dataSource = new MatTableDataSource<Object>(this.data.docs);
    });
  }
  compare(a, b, isAsc) {
    console.log(a, b);
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortData(sort: Sort) {
    const data = this.data.docs.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData.docs = data;
      this.dataSource = new MatTableDataSource<Object>(this.sortedData.docs);
      return;
    } else {
      this.sortedData.docs = data.sort((a, b) => {
        // console.log('sort');
        const isAsc = sort.direction === 'asc';
        if (!a.playId && b.playId) {
          return -1 * (isAsc ? 1 : -1);
        }
        if (a.playId && !b.playId) {
          return 1 * (isAsc ? 1 : -1);
        }
        if (!a.playId && !b.playId) {
          return 1 * (isAsc ? 1 : -1);
        }
        if (a.playId && b.playId) {
          switch (sort.active) {
            case 'testScore': {
              // console.log('test')
              return this.compare(a.playId.totalScore, b.playId.totalScore, isAsc);
            }

            case 'interviewScore': {
              console.log('interview');
              return this.compare(a.playId.interviewScore, b.playId.interviewScore, isAsc);
            }

            case 'avgScore': {
              const avgA = (a.playId.totalScore + a.playId.interviewScore) / 2;
              const avgB = (b.playId.totalScore + b.playId.interviewScore) / 2;
              return this.compare(avgA, avgB, isAsc);
            }
            case 'status': {
              return this.compare(a.playId.status, b.status, isAsc);
            }
            default:
              return 0;
          }
        }
      });
      // console.log(this.sortedData.docs);
      this.dataSource = new MatTableDataSource<Object>(this.sortedData.docs);
    }
  }
  // openDialog(title: string, content: string, studentId: string, callback: Function) {
  //   let dialogRef = this.dialog.open(QuestionDialogComponent, {
  //     width: '250px',
  //     data: { name: title, content: content }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     return callback(result);
  //   });
  // }
}
