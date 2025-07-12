--- a/shlomixx/link-cloud-pro-ui/shlomixx-link-cloud-pro-ui-0e1d06010fe1bcf89277b8cd68bddb4223d57a22/src/components/LinkModal.tsx
+++ b/shlomixx/link-cloud-pro-ui/shlomixx-link-cloud-pro-ui-0e1d06010fe1bcf89277b8cd68bddb4223d57a22/src/components/LinkModal.tsx
@@ -1,7 +1,7 @@
 
 import React from 'react';
 import { Trash2 } from 'lucide-react';
-import { Button } from '@/components/ui/button';
+import { Button } from '@/components/ui/button'; // Import Button for Alert Dialog actions
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
 import { Label } from '@/components/ui/label';
 import { Input } from '@/components/ui/input';
@@ -9,6 +9,7 @@
 import { Switch } from '@/components/ui/switch';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 
+import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
 interface LinkData {
   key: string;
   name: string;
@@ -82,19 +83,43 @@
         
         <div className="flex justify-between pt-4">
           <div>
-            {!isNewLink && (
-              <Button
-                variant="destructive"
-                onClick={onDelete}
-                disabled={isLoading}
-                className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
-              >
-                {isLoading ? (
-                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
-                ) : (
-                  <Trash2 className="w-4 h-4 mr-2" />
-                )}
-                Delete
-              </Button>
-            )}
+            {!isNewLink && editingLink && (
+              <AlertDialog>
+                <AlertDialogTrigger asChild>
+                  <Button
+                    variant="destructive"
+                    disabled={isLoading}
+                    className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
+                  >
+                    <Trash2 className="w-4 h-4 mr-2" />
+                    Delete
+                  </Button>
+                </AlertDialogTrigger>
+                <AlertDialogContent className={`${isDarkMode ? 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm' : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-sm'}`}>
+                  <AlertDialogHeader>
+                    <AlertDialogTitle className="text-xl font-bold">Confirm Deletion</AlertDialogTitle>
+                    <AlertDialogDescription className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
+                      Are you sure you want to delete &quot;{editingLink.name}&quot;? This action cannot be undone.
+                    </AlertDialogDescription>
+                  </AlertDialogHeader>
+                  <AlertDialogFooter>
+                    <AlertDialogCancel
+                      className={`transition-all duration-300 hover:scale-105 ${
+                        isDarkMode 
+                          ? 'border-slate-600 text-white hover:bg-slate-800/50' 
+                          : 'border-slate-300 text-slate-800 hover:bg-slate-100/50'
+                      }`}
+                    >
+                      Cancel
+                    </AlertDialogCancel>
+                    <AlertDialogAction
+                      onClick={onDelete}
+                      className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
+                    >
+                      Delete
+                    </AlertDialogAction>
+                  </AlertDialogFooter>
+                </AlertDialogContent>
+              </AlertDialog>
+            )}
           </div>
           
           <div className="flex gap-2">