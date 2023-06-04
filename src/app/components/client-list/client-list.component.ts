import { Component, OnInit } from '@angular/core';
import { NgbModal,NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../services/client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  searchKey: string = '';
  clientForm!: FormGroup;
  createModal: NgbModalRef | undefined;
  showSearchForm = false;
  searchParams: any = {};
  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private clientService: ClientService, private modalService: NgbModal) {
    this.searchForm = this.formBuilder.group({
      searchKeyClient: [''],
      searchName: [''],
      searchEmail: [''],
      searchPhone: [''],
      searchStartDate: [''],
      searchEndDate: ['']
    });
  }

  toggleSearchForm(): void {
    this.showSearchForm = !this.showSearchForm;
    this.searchForm.reset();
    this.searchParams = {};
    if (!this.showSearchForm) {
      this.loadClients();
    }
  }
  searchClients(): void {
    this.searchParams = this.searchForm.value;
    this.clientService.getClientByParams(this.searchParams).subscribe(
      (response) => {
        this.clients = response;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  ngOnInit(): void {
    this.loadClients();
    this.initClientForm();
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

  initClientForm(): void {
    this.clientForm = this.formBuilder.group({
      keyClient: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  openCreateModal(content: any): void {
    this.clientForm.reset(); // Reinicia el formulario al abrir el modal
    this.createModal = this.modalService.open(content, { centered: true });
  }

  createClient(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched(); // Marcar todos los campos como tocados para activar la validación y mostrar los mensajes de error
      return;
    }
  
    const client = this.clientForm.value;
  
    this.clientService.createClient(client).subscribe(
      (response) => {
        console.log('Client created:', response);
        this.loadClients();
        if (this.createModal) {
          this.createModal.dismiss();
        }
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
  exportClientsToExcel(): void {
    
    const data: any[] = this.clients.map((client: any) => ({
      'Key': client.keyClient,
      'Nombre': client.name,
      'Email': client.email,
      'Telefono': client.phone,
      'Fecha de iniciò': client.startDate,
      'Fecha de finalizaciòn': client.endDate
    })); 
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();   
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');   
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });   
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(dataBlob, 'clientes.xlsx');
  }
}