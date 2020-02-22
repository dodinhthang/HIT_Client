import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatPaginator } from '@angular/material';
import { QuestionDialogComponent } from '../../question-dialog/question-dialog.component';
import { Router } from '@angular/router';
import { EditAddQuestionListDialogComponent } from './question-dialog/question-list-dialog.component';
import { QuestionListService } from '../../services/question-list.service';
@Component({
  selector: 'app-question-list-manager',
  templateUrl: './question-list-manager.component.html',
  styleUrls: ['./question-list-manager.component.scss']
})
export class QuestionListManagerComponent implements OnInit {
  displayedColumns = ['position', 'name', 'usingQuestion','questions',  'action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource;
  count = 0;
  updateRef;
  data = {
    total: 10,
    docs: []
  };
  // pageEvent: PageEvent;
  pageIndex;
  currentPage = 1;
  currentLimit = 10;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private questionService: QuestionListService, public dialog: MatDialog, public snackBar: MatSnackBar, private router: Router) {}

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
    this.questionService.GetQuestions(page, limit).then(result => {
      console.log(result)
      this.data = result.data;
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
      this.dataSource.paginator = this.paginator;
    });
  }
  GetIndexPage(event) {
    this.questionService.GetQuestions(event.pageIndex + 1, event.pageSize).then(result => {
      this.currentPage = event.pageIndex + 1;
      this.currentLimit = event.pageSize;
      this.data = result.data;
      this.dataSource = new MatTableDataSource<Object>(result.data.docs);
    });
  }
  openDialog(title: string, content: string, studentId: string, callback: Function) {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '250px',
      height: 'auto',
      data: { name: title, content: content }
    });

    dialogRef.afterClosed().subscribe(result => {
      return callback(result);
    });
  }
  Open(studentId: string, comand: string) {
    if (comand == 'delete') {
      this.openDialog('Thông báo', 'Bạn có muốn xóa câu hỏi này?', studentId, result => {
        if (result == true) {
          this.questionService
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
    this.questionService
      .GetQuestionById(id)
      .then(data => {
        if (data.code == 1) {
          this.updateRef = this.dialog.open(EditAddQuestionListDialogComponent, {
            width: '500px',
            data: data.data
          });
          this.updateRef.afterClosed().subscribe(result => {
            this.questionService.Update(result).then(re => {
              this.SetData(this.currentPage, this.currentLimit);
              this.openSnackBar('Cập nhập câu hỏi thành công ', 'Đóng');
            });
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
    let data = {
      content: '',
      correctAnswer: null,
      isHaveOption: true,
      isHtml: false,
      // tslint:disable-next-line:max-line-length
      options: [{ numbering: 'a', answer: '' }, { numbering: 'b', answer: '' }, { numbering: 'b', answer: '' }, { numbering: 'b', answer: '' }],
      score: 0
    };

    this.updateRef = this.dialog.open(EditAddQuestionListDialogComponent, {
      width: '500px',
      data: data
    });
    this.updateRef.afterClosed().subscribe(result => {
      this.questionService
        .Add(result)
        .then(re => {
          this.SetData(this.currentPage, this.currentLimit);
          this.openSnackBar('Thêm câu hỏi thành công ', 'Đóng');
        })
        .catch(err => {
          this.openSnackBar('Thêm câu hỏi thất bại ', 'Đóng');
        });
    });
  }
  countQuestion(questions){

    return questions.length;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }
}
