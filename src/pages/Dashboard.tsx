
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate('/auth');
          return;
        }
        
        setUser(data.session.user);
        
        // Fetch pricing plans
        const { data: plans, error } = await supabase
          .from('pricing_plans')
          .select('*')
          .order('price');
          
        if (error) throw error;
        
        setPricingPlans(plans || []);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const createEmptyPlan = {
    name: '',
    price: 0,
    description: '',
    features: [],
    is_popular: false,
  };

  const [editingPlan, setEditingPlan] = useState<any>(createEmptyPlan);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  const handleEditPlan = (plan: any) => {
    setEditingPlan({...plan});
    setIsNewPlan(false);
  };
  
  const handleNewPlan = () => {
    setEditingPlan(createEmptyPlan);
    setIsNewPlan(true);
  };
  
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...editingPlan.features];
    updatedFeatures.splice(index, 1);
    setEditingPlan({...editingPlan, features: updatedFeatures});
  };
  
  const handleSavePlan = async () => {
    try {
      if (isNewPlan) {
        const { data, error } = await supabase
          .from('pricing_plans')
          .insert([{
            name: editingPlan.name,
            price: editingPlan.price,
            description: editingPlan.description,
            features: editingPlan.features,
            is_popular: editingPlan.is_popular,
          }])
          .select();
          
        if (error) throw error;
        
        setPricingPlans([...pricingPlans, data[0]]);
        
        toast({
          title: "Plan Created",
          description: `${editingPlan.name} has been created successfully.`
        });
      } else {
        const { error } = await supabase
          .from('pricing_plans')
          .update({
            name: editingPlan.name,
            price: editingPlan.price,
            description: editingPlan.description,
            features: editingPlan.features,
            is_popular: editingPlan.is_popular,
          })
          .eq('id', editingPlan.id);
          
        if (error) throw error;
        
        setPricingPlans(pricingPlans.map(plan => 
          plan.id === editingPlan.id ? editingPlan : plan
        ));
        
        toast({
          title: "Plan Updated",
          description: `${editingPlan.name} has been updated successfully.`
        });
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description: "Failed to save pricing plan.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setPricingPlans(pricingPlans.filter(plan => plan.id !== id));
      
      toast({
        title: "Plan Deleted",
        description: "The pricing plan has been deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete pricing plan.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Button 
            onClick={handleSignOut} 
            variant="outline"
            className="border-psyco-green-DEFAULT text-psyco-green-DEFAULT hover:bg-psyco-green-DEFAULT/10"
          >
            Sign Out
          </Button>
        </div>
        
        <div className="glassmorphism p-6 rounded-xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Pricing Plans</h2>
            <Button 
              onClick={handleNewPlan}
              className="bg-psyco-green-DEFAULT hover:bg-psyco-green-dark"
            >
              Add New Plan
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id}
                className="bg-psyco-black-card p-6 rounded-lg border border-gray-700 flex flex-col"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-2xl text-psyco-green-DEFAULT font-bold mb-2">
                    ${parseFloat(plan.price).toFixed(2)}
                  </div>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  
                  {plan.is_popular && (
                    <div className="bg-psyco-green-DEFAULT/20 text-psyco-green-DEFAULT text-xs font-bold py-1 px-2 rounded-full inline-block mb-4">
                      Popular
                    </div>
                  )}
                </div>
                
                <div className="mb-6 flex-grow">
                  <h4 className="text-sm font-semibold text-white mb-2">Features:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-400 text-sm flex items-start">
                        <span className="text-psyco-green-DEFAULT mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-psyco-green-DEFAULT text-psyco-green-DEFAULT hover:bg-psyco-green-DEFAULT/10"
                        onClick={() => handleEditPlan(plan)}
                      >
                        Edit
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-psyco-black-light border-gray-700">
                      <SheetHeader>
                        <SheetTitle className="text-white">Edit Plan</SheetTitle>
                      </SheetHeader>
                      <div className="py-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300 block mb-2">Name</label>
                          <Input
                            value={editingPlan.name}
                            onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                            placeholder="Plan Name"
                            className="bg-psyco-black-card"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-300 block mb-2">Price</label>
                          <Input
                            type="number"
                            value={editingPlan.price}
                            onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                            placeholder="0.00"
                            className="bg-psyco-black-card"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-300 block mb-2">Description</label>
                          <Input
                            value={editingPlan.description}
                            onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                            placeholder="Plan description"
                            className="bg-psyco-black-card"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_popular"
                            checked={editingPlan.is_popular}
                            onChange={(e) => setEditingPlan({...editingPlan, is_popular: e.target.checked})}
                            className="rounded border-gray-700 bg-psyco-black-card text-psyco-green-DEFAULT"
                          />
                          <label htmlFor="is_popular" className="text-sm font-medium text-gray-300">
                            Mark as Popular
                          </label>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-300 block mb-2">Features</label>
                          <div className="space-y-2 mb-4">
                            {editingPlan.features.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Input
                                  value={feature}
                                  readOnly
                                  className="bg-psyco-black-card flex-grow"
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRemoveFeature(index)}
                                  className="text-red-500 hover:text-red-400"
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex space-x-2">
                            <Input
                              value={featureInput}
                              onChange={(e) => setFeatureInput(e.target.value)}
                              placeholder="New feature"
                              className="bg-psyco-black-card flex-grow"
                            />
                            <Button onClick={handleAddFeature}>Add</Button>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleSavePlan}
                          className="w-full bg-psyco-green-DEFAULT hover:bg-psyco-green-dark mt-4"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            
            {pricingPlans.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <p className="mb-4">No pricing plans available</p>
                <Button 
                  onClick={handleNewPlan}
                  className="bg-psyco-green-DEFAULT hover:bg-psyco-green-dark"
                >
                  Add Your First Plan
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
