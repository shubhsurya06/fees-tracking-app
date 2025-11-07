import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { IAlert } from '../../../core/model/alert-model';

@Component({
  selector: 'app-alert-box',
  imports: [NgClass],
  templateUrl: './alert-box.html',
  styleUrl: './alert-box.scss'
})
export class AlertBox {

  @Input() isShowSuccess: Boolean = false;

  @Input() alertReq!: IAlert;

}
