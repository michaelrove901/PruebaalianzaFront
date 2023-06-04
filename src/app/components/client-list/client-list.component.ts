import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  searchKey: string = '';

  constructor(private clientService: ClientService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (response) => {
        this.clients = response;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  openCreateModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  createClient(client: any): void {
    this.clientService.createClient(client).subscribe(
      (response) => {
        console.log('Client created:', response);
        this.loadClients();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  searchByKey(): void {
    if (this.searchKey.trim() !== '') {
      this.clientService.getClientByKey(this.searchKey).subscribe(
        (response) => {
          this.clients = response ? [response] : [];
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    } else {
      this.loadClients();
    }
  }
}