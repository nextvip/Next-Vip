import { useCallback, useEffect, useState } from "react";
import { Bot, History, Play, Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonLoading } from "../../../components/common/LoadingState";
import {
  createRule,
  createTemplate,
  deleteRule,
  deleteTemplate,
  getExecutions,
  getRules,
  getTemplateDefaults,
  getTemplates,
  previewTemplate,
  testCommentTrigger,
  updateRule,
  updateTemplate,
} from "../../../services/automationServices";

const emptyTemplateForm = () => ({
  name: "",
  triggerKeywords: "*",
  publicReplyTemplate: "",
  privateDmTemplate: "",
  customVariables: {
    tiktok_link: "",
    amazon_link: "",
    whatsapp: "",
    product: "",
    link: "",
  },
  isActive: true,
});

export default function AutomationPage() {
  const [tab, setTab] = useState("templates");
  const [templates, setTemplates] = useState([]);
  const [rules, setRules] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTemplateForm());
  const [preview, setPreview] = useState(null);
  const [testComment, setTestComment] = useState("Precio");
  const [testUsername, setTestUsername] = useState("usuario_ejemplo");
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const [ruleForm, setRuleForm] = useState({
    name: "Reply to all comments",
    templateId: "",
    priority: 10,
    isActive: true,
  });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, rRes, eRes, dRes] = await Promise.all([
        getTemplates(),
        getRules(),
        getExecutions(),
        getTemplateDefaults(),
      ]);
      setTemplates(tRes.data.templates || []);
      setRules(rRes.data.rules || []);
      setExecutions(eRes.data.executions || []);
      setVariables(dRes.data.variables || []);

      if (!editingId && dRes.data.defaults) {
        setForm({
          name: "Default comment automation",
          triggerKeywords: (dRes.data.defaults.triggerKeywords || ["*"]).join(", "),
          publicReplyTemplate: dRes.data.defaults.publicReplyTemplate || "",
          privateDmTemplate: dRes.data.defaults.privateDmTemplate || "",
          customVariables: {
            tiktok_link: "",
            amazon_link: "",
            whatsapp: "+1 570 241 4290",
            product: "",
            link: "",
          },
          isActive: true,
        });
      }

      if (!ruleForm.templateId && tRes.data.templates?.length) {
        setRuleForm((prev) => ({
          ...prev,
          templateId: tRes.data.templates[0].id || tRes.data.templates[0]._id,
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load automation");
    } finally {
      setLoading(false);
    }
  }, [editingId, ruleForm.templateId]);

  useEffect(() => {
    loadAll();
  }, []);

  const parseKeywords = (text) =>
    text
      .split(/[,;\n]+/)
      .map((k) => k.trim())
      .filter(Boolean);

  const handleSaveTemplate = async () => {
    if (!form.name.trim()) {
      toast.error("Template name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        triggerKeywords: parseKeywords(form.triggerKeywords),
        publicReplyTemplate: form.publicReplyTemplate,
        privateDmTemplate: form.privateDmTemplate,
        customVariables: form.customVariables,
        isActive: form.isActive,
      };

      if (editingId) {
        await updateTemplate(editingId, payload);
        toast.success("Template updated");
      } else {
        await createTemplate(payload);
        toast.success("Template created");
      }

      setEditingId(null);
      setForm(emptyTemplateForm());
      await loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEditTemplate = (t) => {
    setEditingId(t.id || t._id);
    setForm({
      name: t.name,
      triggerKeywords: (t.trigger_keywords || t.triggerKeywords || ["*"]).join(", "),
      publicReplyTemplate: t.public_reply_template || t.publicReplyTemplate || "",
      privateDmTemplate: t.private_dm_template || t.privateDmTemplate || "",
      customVariables: {
        tiktok_link: t.custom_variables?.tiktok_link || "",
        amazon_link: t.custom_variables?.amazon_link || "",
        whatsapp: t.custom_variables?.whatsapp || "",
        product: t.custom_variables?.product || "",
        link: t.custom_variables?.link || "",
      },
      isActive: t.is_active ?? t.isActive ?? true,
    });
    setTab("templates");
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await deleteTemplate(id);
      toast.success("Template deleted");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyTemplateForm());
      }
      await loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handlePreview = async () => {
    const templateId = editingId || templates[0]?.id || templates[0]?._id;
    if (!templateId) {
      toast.error("Save a template first to preview");
      return;
    }
    try {
      const { data } = await previewTemplate({
        templateId,
        commentText: testComment,
        username: testUsername,
        customVariables: form.customVariables,
      });
      setPreview(data.preview);
    } catch (err) {
      toast.error(err.response?.data?.message || "Preview failed");
    }
  };

  const handleSaveRule = async () => {
    if (!ruleForm.templateId) {
      toast.error("Select a template for the rule");
      return;
    }
    setSaving(true);
    try {
      await createRule({
        name: ruleForm.name,
        templateId: ruleForm.templateId,
        priority: ruleForm.priority,
        isActive: ruleForm.isActive,
        conditions: { keywords: ["*"], stop_after_match: true },
        actions: { public_reply: true, send_dm: true },
      });
      toast.success("Rule created");
      await loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create rule");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRule = async (rule) => {
    const id = rule.id || rule._id;
    try {
      await updateRule(id, { isActive: !(rule.is_active ?? rule.isActive) });
      await loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm("Delete this rule?")) return;
    try {
      await deleteRule(id);
      toast.success("Rule deleted");
      await loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const { data } = await testCommentTrigger({
        commentText: testComment,
        username: testUsername,
        platform: "instagram",
        tiktokLink: form.customVariables.tiktok_link,
        amazonLink: form.customVariables.amazon_link,
        whatsapp: form.customVariables.whatsapp,
      });
      setTestResult(data);
      await loadAll();
      toast.success(data.matched ? "Automation triggered" : "No rule matched");
    } catch (err) {
      toast.error(err.response?.data?.message || "Test failed");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-7 w-7 text-violet-600" />
          Automation
        </h2>
        <p className="text-muted-foreground">
          Configure comment replies and private DMs for your posts.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? "Edit template" : "New template"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Default comment automation"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trigger keywords</Label>
                  <Input
                    value={form.triggerKeywords}
                    onChange={(e) => setForm({ ...form, triggerKeywords: e.target.value })}
                    placeholder="precio, price, info, * (all comments)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use * or leave empty to reply to every comment.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Public reply</Label>
                  <Textarea
                    rows={2}
                    value={form.publicReplyTemplate}
                    onChange={(e) =>
                      setForm({ ...form, publicReplyTemplate: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Private DM</Label>
                  <Textarea
                    rows={10}
                    value={form.privateDmTemplate}
                    onChange={(e) =>
                      setForm({ ...form, privateDmTemplate: e.target.value })
                    }
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {["tiktok_link", "amazon_link", "whatsapp", "product", "link"].map((key) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{`{${key}}`}</Label>
                      <Input
                        value={form.customVariables[key] || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            customVariables: {
                              ...form.customVariables,
                              [key]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                {variables.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {variables.map((v) => (
                      <Badge key={v.key} variant="secondary" className="text-xs">
                        {`{${v.key}}`}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleSaveTemplate} disabled={saving}>
                    {saving ? <ButtonLoading /> : editingId ? "Update" : "Create"}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyTemplateForm());
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : templates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No templates yet. Create one using the client&apos;s Spanish DM format on the left.
                  </p>
                ) : (
                  templates.map((t) => (
                    <div
                      key={t.id || t._id}
                      className="flex items-start justify-between gap-2 rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Keywords: {(t.trigger_keywords || []).join(", ") || "*"}
                        </p>
                        <Badge
                          variant={t.is_active ? "default" : "secondary"}
                          className="mt-2"
                        >
                          {t.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEditTemplate(t)}>
                          Edit
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteTemplate(t.id || t._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                IF/THEN rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rule name</Label>
                  <Input
                    value={ruleForm.name}
                    onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Template</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={ruleForm.templateId}
                    onChange={(e) =>
                      setRuleForm({ ...ruleForm, templateId: e.target.value })
                    }
                  >
                    <option value="">Select template</option>
                    {templates.map((t) => (
                      <option key={t.id || t._id} value={t.id || t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                IF someone comments (any keyword from template) → THEN public reply + private DM.
              </p>
              <Button onClick={handleSaveRule} disabled={saving || !templates.length}>
                <Plus className="h-4 w-4 mr-2" />
                Add rule
              </Button>

              <div className="space-y-2 pt-4">
                {rules.map((r) => (
                  <div
                    key={r.id || r._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Priority {r.priority} · {r.trigger_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={r.is_active ?? r.isActive}
                        onCheckedChange={() => handleToggleRule(r)}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteRule(r.id || r._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-5 w-5" />
                Test comment trigger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sample comment</Label>
                  <Input
                    value={testComment}
                    onChange={(e) => setTestComment(e.target.value)}
                    placeholder="Precio"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Commenter username</Label>
                  <Input
                    value={testUsername}
                    onChange={(e) => setTestUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleTest} disabled={testing}>
                  {testing ? <ButtonLoading /> : "Run test"}
                </Button>
                <Button variant="outline" onClick={handlePreview}>
                  Preview template only
                </Button>
              </div>

              {preview && (
                <div className="space-y-3 rounded-lg bg-slate-50 p-4 text-sm">
                  <p>
                    <strong>Matches:</strong> {preview.matches ? "Yes" : "No"}
                  </p>
                  <div>
                    <strong>Public reply:</strong>
                    <p className="mt-1 whitespace-pre-wrap">{preview.publicReply}</p>
                  </div>
                  <div>
                    <strong>Private DM:</strong>
                    <p className="mt-1 whitespace-pre-wrap">{preview.privateDm}</p>
                  </div>
                </div>
              )}

              {testResult && (
                <div className="space-y-3 rounded-lg border p-4 text-sm">
                  <Badge variant={testResult.matched ? "default" : "secondary"}>
                    {testResult.matched ? "Rule matched" : "No match"}
                  </Badge>
                  {testResult.execution?.dm_text && (
                    <div>
                      <strong>DM that would be sent:</strong>
                      <p className="mt-1 whitespace-pre-wrap">{testResult.execution.dm_text}</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{testResult.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Execution history
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Public reply</TableHead>
                    <TableHead>DM</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No executions yet. Run a test from the Test tab.
                      </TableCell>
                    </TableRow>
                  ) : (
                    executions.map((e) => (
                      <TableRow key={e.id || e._id}>
                        <TableCell className="text-xs">
                          {e.executed_at
                            ? new Date(e.executed_at).toLocaleString()
                            : e.executedAt
                              ? new Date(e.executedAt).toLocaleString()
                              : "—"}
                        </TableCell>
                        <TableCell className="text-xs">{e.trigger_type}</TableCell>
                        <TableCell>
                          <Badge variant={e.public_reply_sent ? "default" : "secondary"}>
                            {e.public_reply_sent ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={e.dm_sent ? "default" : "secondary"}>
                            {e.dm_sent ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={e.status === "failed" ? "destructive" : "outline"}
                          >
                            {e.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
