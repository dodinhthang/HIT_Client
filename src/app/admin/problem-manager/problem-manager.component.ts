import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatPaginator } from '@angular/material';
import { QuestionDialogComponent } from '../../question-dialog/question-dialog.component';
import { ProblemService } from '../../services/problem.service';
import { Router } from '@angular/router';
import { ProblemDialogComponent } from './problem-dialog/problem-dialog.component';
@Component({
  selector: 'app-problem-manager',
  templateUrl: './problem-manager.component.html',
  styleUrls: ['./problem-manager.component.scss'],
  providers: [ProblemService]
})
export class ProblemManagerComponent implements OnInit {
  displayedColumns = ['position', 'title', 'sortName', 'level', 'language', 'correctScore', 'action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource;
  count = 0;
  updateRef;
  addRef;
  data = {
    total: 10,
    docs: []
  };
  pageEvent: PageEvent;
  pageIndex;
  currentPage = 1;
  currentLimit = 10;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  constructor(private queS: ProblemService, public dialog: MatDialog, public snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    this.SetData(1, 10);
  }
  // Style Function

  getRowStyle(element) {
    if (this.data.docs.indexOf(element) % 2 === 0) {
      return 'rgba(0,0,0,.001)';
    } else {
      return 'rgba(0,0,0,.03)';
    }
  }

  // End Style Function
  SetData(page, limit) {
    this.queS.GetQuestions(page, limit).then(result => {
      this.data = result.data;
      console.log(this.data);
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
      this.dataSource.paginator = this.paginator;
    });
  }
  GetIndexPage(event) {
    this.queS.GetQuestions(event.pageIndex + 1, event.pageSize).then(result => {
      this.currentPage = event.pageIndex + 1;
      this.currentLimit = event.pageSize;
      this.data = result.data;
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
    });
  }
  openDialog(title: string, content: string, studentId: string, callback: Function) {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '250px',
      data: { name: title, content: content }
    });

    dialogRef.afterClosed().subscribe(result => {
      return callback(result);
    });
  }
  Open(studentId: string, title: String, comand: string) {
    if (comand == 'delete') {
      this.openDialog('Thông báo', 'Bạn có muốn xóa câu hỏi lập trình: ' + title, studentId, result => {
        if (result == true) {
          this.queS
            .DeleteQuestion(studentId)
            .then(resultDelete => {
              if (resultDelete.code == 1) {
                this.openSnackBar(resultDelete.message, 'Đóng');
                this.SetData(this.currentPage, this.currentLimit);
              } else {
                this.openSnackBar(resultDelete.message, 'Đóng');
              }
            })
            .catch(err => console.log(err));
        }
      });
    }
  }
  Update(id: string) {
    this.queS
      .GetQuestionById(id)
      .then(data => {
        console.log(data.data);
        if (data.code == 1) {
          this.updateRef = this.dialog.open(ProblemDialogComponent, {
            width: '500px',
            data: data.data
          });
          this.updateRef.afterClosed().subscribe(result => {
            if (result !== 0) {
              this.queS.Update(result).then(re => {
                this.SetData(this.currentPage, this.currentLimit);
                this.openSnackBar('Cập nhập câu hỏi thành công ', 'Đóng');
              });
            }
          });
        } else {
          this.openSnackBar('Bạn không có quyền ', 'Đóng');
        }
      })
      .catch(err => {
        this.openSnackBar('Không tìm thấy câu hỏi', 'Đóng');
      });
  }
  Add() {
    const data = {
      title: '',
      content: '',
      input: '',
      output: '',
      example: {
        input: '',
        output: ''
      },
      correctScore: '',
      level: 3,
      timeLimit: '',
      memmoryLimit: '',
      cluster: '',
      language: ''
    };

    this.addRef = this.dialog.open(ProblemDialogComponent, {
      width: '500px',
      data: data
    });
    this.addRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        this.queS
          .Add(result)
          .then(re => {
            this.SetData(this.currentPage, this.currentLimit);
            this.openSnackBar('Thêm câu hỏi thành công ', 'Đóng');
          })
          .catch(err => {
            this.openSnackBar('Thêm câu hỏi thất bại ', 'Đóng');
          });
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }
}
