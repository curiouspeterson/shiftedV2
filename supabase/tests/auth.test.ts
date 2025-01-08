import { createClient } from '@supabase/supabase-js';
import { expect } from 'chai';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

describe('Authentication', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123'
  };

  after(async () => {
    // Clean up test user
    const { data: { user } } = await supabase.auth.signInWithPassword(testUser);
    if (user) {
      await supabase.auth.admin.deleteUser(user.id);
    }
  });

  it('should allow user signup', async () => {
    const { data: { user }, error } = await supabase.auth.signUp(testUser);
    
    expect(error).to.be.null;
    expect(user).to.not.be.null;
    expect(user?.email).to.equal(testUser.email);
  });

  it('should create a profile after signup', async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', testUser.email)
      .single();
    
    expect(profile).to.not.be.null;
    expect(profile?.email).to.equal(testUser.email);
  });

  it('should allow user login', async () => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword(testUser);
    
    expect(error).to.be.null;
    expect(user).to.not.be.null;
    expect(user?.email).to.equal(testUser.email);
  });

  it('should not allow login with incorrect password', async () => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      ...testUser,
      password: 'wrongpassword'
    });
    
    expect(error).to.not.be.null;
    expect(user).to.be.null;
  });

  it('should not allow login with non-existent email', async () => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: 'nonexistent@example.com',
      password: testUser.password
    });
    
    expect(error).to.not.be.null;
    expect(user).to.be.null;
  });
}); 