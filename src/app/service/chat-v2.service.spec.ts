import { TestBed } from '@angular/core/testing';

import { ChatV2Service } from './chat-v2.service';

describe('ChatV2Service', () => {
  let service: ChatV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
