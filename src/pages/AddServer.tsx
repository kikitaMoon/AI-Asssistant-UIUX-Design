
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddServerFormData {
  name: string;
  description: string;
  type: string;
  commands: string[];
}

const AddServer = () => {
  const navigate = useNavigate();
  const [commands, setCommands] = useState<string[]>(['']);
  
  const form = useForm<AddServerFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: '',
      commands: ['']
    }
  });

  const handleAddCommand = () => {
    setCommands([...commands, '']);
  };

  const handleRemoveCommand = (index: number) => {
    if (commands.length > 1) {
      const newCommands = commands.filter((_, i) => i !== index);
      setCommands(newCommands);
    }
  };

  const handleCommandChange = (index: number, value: string) => {
    const newCommands = [...commands];
    newCommands[index] = value;
    setCommands(newCommands);
  };

  const onSubmit = (data: AddServerFormData) => {
    const serverData = {
      ...data,
      commands: commands.filter(cmd => cmd.trim() !== '')
    };
    console.log('Adding new MCP server:', serverData);
    // Here you would typically save the server data
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Add New MCP Server
            </h1>
            <p className="text-gray-400 mt-1">Configure a new Model Context Protocol server</p>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Server Name */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Server name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter server name (e.g., Database Server)"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Describe what this server does and its capabilities"
                      className="w-full min-h-[100px] p-3 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Server Type */}
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "Server type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select server type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="database">Database Server</SelectItem>
                        <SelectItem value="filesystem">File System</SelectItem>
                        <SelectItem value="api">API Gateway</SelectItem>
                        <SelectItem value="compute">Compute Server</SelectItem>
                        <SelectItem value="storage">Storage Server</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Commands */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Commands</Label>
                <Button
                  type="button"
                  onClick={handleAddCommand}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Command
                </Button>
              </div>
              <div className="space-y-3">
                {commands.map((command, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      value={command}
                      onChange={(e) => handleCommandChange(index, e.target.value)}
                      placeholder={`Command ${index + 1} (e.g., db:query)`}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    {commands.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleRemoveCommand(index)}
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-4 pt-6">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                Add Server
              </Button>
              <Button
                type="button"
                onClick={() => navigate('/')}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddServer;
